from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import re
import numpy as np
import ast

app = FastAPI(root_path="/api")

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
        df = pd.read_csv('movies_small.csv')
    except FileNotFoundError:
        print("ERROR: 'tmdb_movies.csv' not found. Please download it from Kaggle.")
        return

    # 1. CLEANING
    df = df.dropna(subset=['id', 'title', 'overview', 'poster_path'])
    df['id'] = df['id'].astype(int)
    
    # Force numbers
    df['vote_count'] = pd.to_numeric(df['vote_count'], errors='coerce').fillna(0)
    df['vote_average'] = pd.to_numeric(df['vote_average'], errors='coerce').fillna(0)
    
    # Filter for quality
    df = df[df['vote_count'] > 50].copy() 
    
    # 2. GENRE PARSING
    df['genres'] = df['genres'].astype(str)
    if df['genres'].iloc[0].startswith('['):
        try:
            df['genres'] = df['genres'].apply(lambda x: ', '.join([g['name'] for g in ast.literal_eval(x)]) if x.startswith('[') else x)
        except:
            pass 
    
    df['year'] = pd.to_datetime(df['release_date'], errors='coerce').dt.year.fillna(0).astype(int)
    
    # 3. WEIGHTED SCORE (The "Impact" Metric)
    # This identifies "High Quality" movies (High Ratings + High Vote Count)
    C = df['vote_average'].mean()
    m = df['vote_count'].quantile(0.8)
    def weighted_rating(x, m=m, C=C):
        v = x['vote_count']
        R = x['vote_average']
        return (v/(v+m) * R) + (m/(v+m) * C)
    df['weighted_score'] = df.apply(weighted_rating, axis=1)
    
    # 4. TRAIN MODEL (Top 20k)
    df_small = df.sort_values('vote_count', ascending=False).head(20000).reset_index(drop=True)
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_small['overview'].fillna(''))
    cosine_sim_matrix = linear_kernel(tfidf_matrix, tfidf_matrix)
    
    movies_df = df_small
    cosine_sim = cosine_sim_matrix
    print("Data Loaded & Model Trained!")

# --- HELPER ---
def process_movie_row(row):
    p_path = str(row.get('poster_path', '')).strip()
    b_path = str(row.get('backdrop_path', '')).strip()

    if p_path and p_path.lower() != 'nan':
        if not p_path.startswith('/'): p_path = '/' + p_path
        poster = f"{IMAGE_BASE_URL}{p_path}"
    else:
        poster = "https://via.placeholder.com/500x750?text=No+Image"

    if b_path and b_path.lower() != 'nan':
        if not b_path.startswith('/'): b_path = '/' + b_path
        backdrop = f"{BACKDROP_BASE_URL}{b_path}"
    else:
        backdrop = poster

    # --- FIX: Handle Empty/NaN Descriptions ---
    overview = str(row.get('overview', ''))
    if overview.lower() == 'nan' or not overview.strip():
        overview = "No description available for this movie."

    return {
        'id': int(row['id']),
        'title': row['title'],
        'year': int(row['year']),
        'rating': round(row['vote_average'], 1),
        'poster': poster,
        'poster_url': poster,
        'backdrop': backdrop,
        'backdrop_url': backdrop, 
        'tmdbId': int(row['id']),
        'genres': str(row['genres']).split(', ')[:3],
        'description': overview # <--- Now safe from NaNs
    }

# --- ENDPOINTS ---

@app.get("/home")
def get_home_content():

    print("Hello")
    global movies_df
    if movies_df is None: return []

    categories = []
    
    # This shows in the Browser (good for testing connection)
    return {
        "debug_message": "Hello from the browser!", 
        "data": categories
    }

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
    categories.append(get_section("Romance & Drama", genre="Romance"))
    categories.append(get_section("Action & Adventure", genre="Action"))
    categories.append(get_section("Sci-Fi & Fantasy", genre="Science"))
    categories.append(get_section("Comedy Hits", genre="Comedy"))

    return categories

@app.get("/search")
def search_movies_endpoint(query: str):
    global movies_df
    if not query: return []
    
    def clean_text(text): return re.sub(r'[^a-zA-Z0-9 ]', '', str(text)).lower()
    query_clean = clean_text(query)
    
    search_df = movies_df.copy()
    search_df['clean_title'] = search_df['title'].apply(clean_text)
    matches = search_df[search_df['clean_title'].str.contains(query_clean)].copy()
    if matches.empty: return []
    
    matches['score'] = matches['clean_title'].apply(lambda x: 2 if x.startswith(query_clean) else 1)
    matches = matches.sort_values(['score', 'vote_count'], ascending=[False, False])
    return matches.head(5)[['title', 'year']].to_dict(orient='records')

@app.get("/discover")
def discover_movies(genre: str = None, min_year: int = 1900, min_rating: float = 0.0):
    global movies_df
    filtered = movies_df[
        (movies_df['year'] >= min_year) & 
        (movies_df['vote_average'] >= min_rating)
    ]
    if min_rating > 6.0:
         filtered = filtered[filtered['vote_count'] > 30]

    if genre and genre != "All":
        search_genre = "Science" if genre == "Sci-Fi" else genre
        filtered = filtered[filtered['genres'].str.contains(search_genre, case=False, na=False)]
        
    results = filtered.sort_values('weighted_score', ascending=False).head(21)
    return [process_movie_row(row) for _, row in results.iterrows()]

# --- REVISED RECOMMENDATION LOGIC (Now Respects Filters) ---
@app.get("/recommend")
def get_recommendations(title: str, min_year: int = 1900, min_rating: float = 0.0):
    global movies_df, cosine_sim
    
    # 1. FIND SOURCE MOVIE
    def clean_text(text): return re.sub(r'[^a-zA-Z0-9 ]', '', str(text)).lower()
    clean_query = clean_text(title)
    
    matches = movies_df[movies_df['title'].apply(clean_text).str.contains(clean_query)].copy()
    if matches.empty:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    matches['score'] = matches['title'].apply(lambda x: 2 if clean_text(x).startswith(clean_query) else 1)
    matches = matches.sort_values(['score', 'vote_count'], ascending=[False, False])
    
    source_row = matches.iloc[0]
    idx = source_row.name
    source_genres = set(str(source_row['genres']).split(', '))

    # 2. GATHER CANDIDATES (AI + Title Match)
    candidates = pd.DataFrame()
    
    # A) AI Recommendations (Plot Similarity)
    try:
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        # Get top 30 to have enough buffer for filtering
        sim_scores = sim_scores[1:31] 
        movie_indices = [i[0] for i in sim_scores]
        ai_recs = movies_df.iloc[movie_indices].copy()
        candidates = pd.concat([candidates, ai_recs])
    except:
        pass

    # B) Title Match Recommendations (e.g. Sequels/Prequels)
    title_recs = matches.iloc[1:].head(10).copy()
    candidates = pd.concat([candidates, title_recs])

    # 3. APPLY USER FILTERS (The Fix)
    # ---------------------------------------------------------
    # Filter by Year (from Sidebar)
    candidates = candidates[candidates['year'] >= min_year]
    
    # Filter by Rating (from Sidebar)
    # We assume rating is out of 10. If your slider is 0-5, multiply min_rating by 2.
    candidates = candidates[candidates['vote_average'] >= min_rating]
    # ---------------------------------------------------------

    # 4. APPLY LOGIC FILTERS (Impact & Genre)
    def filter_logic(row):
        # Remove source movie
        if row['id'] == source_row['id']: return False
        
        row_genres = set(str(row['genres']).split(', '))
        
        # Rule 1: ANIMATION GATE
        if "Animation" not in source_genres and "Animation" in row_genres:
            return False

        # Rule 2: GENRE OVERLAP
        if not source_genres.intersection(row_genres):
            return False
            
        return True

    # Apply Filters
    if not candidates.empty:
        candidates = candidates[candidates.apply(filter_logic, axis=1)]
    
    # Remove duplicates
    candidates = candidates.drop_duplicates(subset=['id'])
    
    # 5. FINAL SORT
    final_recs = candidates.sort_values('weighted_score', ascending=False).head(12)

    return {
        "source": process_movie_row(source_row),
        "recommendations": [process_movie_row(row) for _, row in final_recs.iterrows()]
    }