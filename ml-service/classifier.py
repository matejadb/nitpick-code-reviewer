import pandas as pd
import pickle
import os
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

df = pd.read_csv('data/training_data.csv')
df['category'] = df['category'].str.strip()
df = df.drop_duplicates(subset='text')

X = df["text"]
y = df["category"]

model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression())
])

model.fit(X, y)

os.makedirs('models', exist_ok=True)
with open('models/classifier.pkl', 'wb') as f:
    pickle.dump(model, f)

print(f"Training complete")