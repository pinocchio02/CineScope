import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --- STEP 1: LOAD DATA ---
# Make sure the 'ml-latest-small' folder is in the same directory
movies = pd.read_csv('ml-latest-small/movies.csv')
ratings = pd.read_csv('ml-latest-small/ratings.csv')

print("Data Loaded Successfully.")

# --- STEP 2: FEATURE ENGINEERING ---
# Clean the genres (replace pipes with spaces)
movies['genres_clean'] = movies['genres'].str.replace('|', ' ')

# Initialize the Vectorizer
cv = CountVectorizer()

# Create the Matrix (The "Fingerprints")
genre_matrix = cv.fit_transform(movies['genres_clean'])
print(f"Matrix Shape: {genre_matrix.shape}")

# --- STEP 3: CALCULATE SIMILARITY (The part you were missing!) ---
print("Calculating Cosine Similarity... (this might take a second)")
cosine_sim = cosine_similarity(genre_matrix, genre_matrix)

# Create a helper to map movie titles to indices
# This helps us find "Toy Story" is at Index 0
indices = pd.Series(movies.index, index=movies['title']).drop_duplicates()

# --- STEP 4: RECOMMENDATION FUNCTION ---
def get_recommendations(title, cosine_sim=cosine_sim):
    # 1. Get the index of the movie that matches the title
    try:
        idx = indices[title]
    except KeyError:
        return ["Movie not found! Check your spelling."]

    # 2. Get the pairwise similarity scores
    sim_scores = list(enumerate(cosine_sim[idx]))

    # 3. Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # 4. Get the scores of the 10 most similar movies
    # We skip the first one [0] because it's the movie itself
    sim_scores = sim_scores[1:11]

    # 5. Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # 6. Return the titles
    return movies['title'].iloc[movie_indices]

# --- STEP 5: TEST IT ---
test_movie = "Toy Story (1995)"
print(f"\n--- Recommendations for {test_movie} ---")
print(get_recommendations(test_movie))

test_movie_2 = "Jumanji (1995)"
print(f"\n--- Recommendations for {test_movie_2} ---")
print(get_recommendations(test_movie_2))