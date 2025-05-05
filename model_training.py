import pandas as pd
import nltk
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#get data set
df = pd.read_csv("spotify_millsongdata.csv") #read data
df = df.sample(5000).drop('link', axis=1).reset_index(drop=True) #pick 5000 random samples and remove link column

#text preprocessing, set to lowercase and remove escape sequences
df['text'] = df['text'].str.lower().replace(r'^\w\s', ' ', regex = True).replace(r'\n', ' ', regex = True).replace(r'\r', ' ', regex = True)

stemmer = PorterStemmer() #create stemmer object

#tokenizer function using natural language processor
def token(text):
    token = nltk.word_tokenize(text)
    list = [stemmer.stem(i) for i in token]
    return " ".join(list)

tfid = TfidfVectorizer(analyzer='word', stop_words='english') #create vectorizer object
matrix = tfid.fit_transform(df['text']) #create vectors for each song entry's text
similarity_scores = cosine_similarity(matrix) #calculate similarity using cosine similarity formula; each index contains a list of how similar the indexed song is to every other song

#recommends a the top 5 songs using similarity scores, takes a song name as input
def recommender(song_name):
    id = df[df['song']==song_name].index[0]
    distance = sorted(list(enumerate(similarity_scores[id])), reverse = True, key = lambda x:x[1])
    song = []
    for sID in distance[1:6]:
        song.append(df.iloc[sID[0]].song)
    return song