import pandas as pd
import numpy as np
import pickle
import os

# Get the absolute path of the project directory
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the processed dataset
csv_path = os.path.join(project_dir, "processed_songs.csv")
df = pd.read_csv(csv_path)

# Load the similarity matrix
pkl_path = os.path.join(project_dir, "similarity_scores.pkl")
with open(pkl_path, "rb") as f:
    similarity_scores = pickle.load(f)

# def get_recommendations(song_name, top_n=10):
#     # Find the index of the song
#     try:
#         idx = df[df['song'] == song_name].index[0]
#     except IndexError:
#         return []  # Return an empty list if the song is not found

#     # Get similarity scores for the song
#     similar_indices = np.argsort(similarity_scores[idx])[::-1][1:top_n+1]  # Exclude the song itself

#     # Get the recommended songs
#     recommendations = df.iloc[similar_indices][['song', 'artist']].to_dict(orient="records")
#     return recommendations

def get_recommendations(query, top_n=10):
    # Find the index of the song or artist (case-insensitive)
    try:
        idx = df[(df['song'].str.lower() == query.lower()) | (df['artist'].str.lower() == query.lower())].index[0]
    except IndexError:
        return []  # Return an empty list if the song or artist is not found

    # Get similarity scores for the song or artist
    similar_indices = np.argsort(similarity_scores[idx])[::-1][1:top_n+1]  # Exclude the query itself

    # Get the recommended songs
    recommendations = df.iloc[similar_indices][['song', 'artist']].to_dict(orient="records")
    return recommendations

if __name__ == "__main__":
    import sys
    import json

    # Get the song name from the command-line arguments
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No song name provided"}))
        sys.exit(1)

    song_name = sys.argv[1]
    recommendations = get_recommendations(song_name)
    print(json.dumps(recommendations))