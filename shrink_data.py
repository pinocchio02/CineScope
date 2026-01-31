import pandas as pd

# Load your giant dataset
print("Loading giant file... this might take a minute...")
df = pd.read_csv("tmdb_movies.csv")

# Filter: Keep movies with at least 50 votes (removes junk)
# AND keep only the top 30,000 most popular movies
df_clean = df[df['vote_count'] > 50]
df_small = df_clean.sort_values(by='popularity', ascending=False).head(30000)

# Save the new small file
df_small.to_csv("movies_small.csv", index=False)
print(f"Success! New file size: {len(df_small)} movies.")