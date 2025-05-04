import pandas as pd
import nltk
nltk.download('punkt_tab')
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import TFidfVectorizer

#get data set
df = pd.read_csv("spotify_millsongdata.csv") #read data
df = df.sample(5000).drop('link', axis=1).reset_index(drop=True) #pick 5000 random samples and remove link column

#text preprocessing
df['text'] = df['text'].str.lower().replace(r'^\w\s', ' ', regex = True).replace(r'\n', ' ', regex = True).replace(r'\r', ' ', regex = True) #DOUBLE CHECK

stemmer = PorterStemmer()

def token(text):
    token = nltk.word_tokenize(text)
    list = [stemmer.stem(i) for i in token]
    return " ".join(list)