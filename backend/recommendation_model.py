import pandas as pd
import numpy as np
import pickle
import bz2

# Load the processed dataset
df = pd.read_csv("processed_songs.csv")



# # Load the similarity matrix
# with open("similarity_scores.pkl", "rb") as f:
#     similarity_scores = pickle.load(f)

# Load the compressed similarity matrix
with bz2.BZ2File("similarity_scores.pkl", "rb") as f:
    similarity_scores = pickle.load(f)

def get_recommendations(song_name, top_n=10):
    # Find the index of the song
    try:
        idx = df[df['song'] == song_name].index[0]
    except IndexError:
        return []  # Return an empty list if the song is not found

    # Get similarity scores for the song
    similar_indices = np.argsort(similarity_scores[idx])[::-1][1:top_n+1]  # Exclude the song itself

    # Get the recommended songs
    recommendations = df.iloc[similar_indices][['song', 'artist']].to_dict(orient="records")
    return recommendations
