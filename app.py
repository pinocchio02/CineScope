from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np
import ast

app = FastAPI()

# --- CONFIGURATION ---
TMDB_API_KEY = 'd8519ed507bbbe81a00f6a9715b045be'
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL DATA ---
movies_df = None
cosine_sim = None

@app.on_event("startup")
def load_data():
    global movies_df, cosine_sim
    print("Loading TMDB Dataset...")
    
    try:
        df = pd.read_csv('tmdb_movies.csv')
    except FileNotFoundError:
        print("ERROR: 'tmdb_movies.csv' not found. Please download it from Kaggle.")
        return

    # Filter out junk
    df = df[df['vote_count'] > 50].copy() 
    df = df.dropna(subset=['title', 'overview', 'poster_path'])
    
    # Parse Genres
    if isinstance(df['genres'].iloc[0], str) and df['genres'].iloc[0].startswith('['):
        df['genres'] = df['genres'].apply(lambda x: [g['name'] for g in ast.literal_eval(x)] if pd.notnull(x) else [])
        df['genres'] = df['genres'].apply(lambda x: ', '.join(x))
    
    df['year'] = pd.to_datetime(df['release_date'], errors='coerce').dt.year.fillna(0).astype(int)
    
    # Weighted Rating
    C = df['vote_average'].mean()
    m = df['vote_count'].quantile(0.8)
    def weighted_rating(x, m=m, C=C):
        v = x['vote_count']
        R = x['vote_average']
        return (v/(v+m) * R) + (m/(v+m) * C)
    df['weighted_score'] = df.apply(weighted_rating, axis=1)
    
    # Train Model
    df_small = df.sort_values('vote_count', ascending=False).head(20000).reset_index(drop=True)
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_small['overview'].fillna(''))
    cosine_sim_matrix = linear_kernel(tfidf_matrix, tfidf_matrix)
    
    movies_df = df_small
    cosine_sim = cosine_sim_matrix
    print("Data Loaded & Model Trained!")

def process_movie_row(row):
    poster = f"{IMAGE_BASE_URL}{row['poster_path']}" if row['poster_path'] else "https://via.placeholder.com/500x750"
    backdrop = f"{BACKDROP_BASE_URL}{row['backdrop_path']}" if 'backdrop_path' in row and pd.notnull(row['backdrop_path']) else poster

    return {
        'id': int(row['id']),
        'title': row['title'],
        'year': int(row['year']),
        'rating': round(row['vote_average'], 1),
        'poster': poster,
        'backdrop': backdrop,
        'genres': str(row['genres']).split(', ')[:3],
        'description': row['overview']
    }

# --- ENDPOINTS ---

@app.get("/home")
def get_home_content():
    global movies_df
    if movies_df is None: return []

    categories = []
    def get_section(title, sort_by='weighted_score', genre=None, n=20):
        filtered = movies_df
        if genre:
            filtered = filtered[filtered['genres'].str.contains(genre, case=False, na=False)]
        
        modern = filtered[filtered['year'] >= 2020].sort_values(sort_by, ascending=False).head(n//2)
        classic = filtered[filtered['year'] < 2020].sort_values(sort_by, ascending=False).head(n//2)
        combined = pd.concat([modern, classic]).sample(frac=1)
        return {
            "id": title.lower().replace(" ", "_"),
            "title": title,
            "movies": [process_movie_row(row) for _, row in combined.iterrows()]
        }

    categories.append(get_section("Top Rated Gems"))
    categories.append(get_section("Trending Now", sort_by='popularity'))
    categories.append(get_section("Action & Adventure", genre="Action"))
    categories.append(get_section("Sci-Fi & Fantasy", genre="Sci-Fi"))
    categories.append(get_section("Comedy Hits", genre="Comedy"))
    return categories

@app.get("/search")
def search_movies_endpoint(query: str):
    global movies_df
    if not query: return []
    
    # Use the same Smart Sort logic for suggestions
    matches = movies_df[movies_df['title'].str.contains(query, case=False, regex=False)].copy()
    if matches.empty: return []
    
    # Score: 2 = Starts With, 1 = Contains
    matches['score'] = matches['title'].apply(lambda x: 2 if x.lower().startswith(query.lower()) else 1)
    
    # Sort by Score -> Popularity
    matches = matches.sort_values(['score', 'vote_count'], ascending=[False, False])
    
    return matches.head(5)[['title', 'year']].to_dict(orient='records')

@app.get("/discover")
def discover_movies(genre: str = None, min_year: int = 1900, min_rating: float = 0.0):
    global movies_df
    
    filtered = movies_df[
        (movies_df['year'] >= min_year) & 
        (movies_df['vote_average'] >= min_rating)
    ]
    if genre and genre != "All":
        filtered = filtered[filtered['genres'].str.contains(genre, case=False, na=False)]
        
    results = filtered.sort_values('weighted_score', ascending=False).head(21)
    return [process_movie_row(row) for _, row in results.iterrows()]

@app.get("/recommend")
def get_recommendations(title: str):
    global movies_df, cosine_sim
    
    # --- SMART SEARCH LOGIC START ---
    
    # 1. Try finding candidates that contain the query
    matches = movies_df[movies_df['title'].str.contains(title, case=False, regex=False)].copy()
    
    if matches.empty:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    # 2. Rank the candidates
    # Priority A: Exact match (Score 3)
    # Priority B: Starts with query (Score 2)
    # Priority C: Just contains it (Score 1)
    
    def get_search_score(candidate_title):
        candidate_lower = candidate_title.lower()
        query_lower = title.lower()
        if candidate_lower == query_lower:
            return 3
        elif candidate_lower.startswith(query_lower):
            return 2
        else:
            return 1
            
    matches['search_score'] = matches['title'].apply(get_search_score)
    
    # 3. Sort by: Search Score (Desc) -> Vote Count (Desc)
    # This ensures "Ox" (if exists) beats "Boxing Helena", or popular movies beat obscure ones
    matches = matches.sort_values(['search_score', 'vote_count'], ascending=[False, False])
    
    # Pick the winner
    source_row = matches.iloc[0]
    idx = source_row.name # The original dataframe index
    
    # --- SMART SEARCH LOGIC END ---
    
    # Calculate Recommendations
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]
    
    movie_indices = [i[0] for i in sim_scores]
    recommendations = movies_df.iloc[movie_indices]
    
    return {
        "source": process_movie_row(source_row),
        "recommendations": [process_movie_row(row) for _, row in recommendations.iterrows()]
    }