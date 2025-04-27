import pandas as pd

#get data set
df = pd.read_csv("spotify_millsongdata.csv") #read data
df = df.sample(5000).drop('link', axis=1).reset_index(drop=True) #pick 5000 random samples and remove link column

#text preprocessing
df['text'] = df['text'].str.lower().replace(r'^\w\s', ' ', regex = True).replace(r'\n', ' ', regex = True) #DOUBLE CHECK