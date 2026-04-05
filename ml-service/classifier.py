import pandas as pd
import pickle
import os
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report

df = pd.read_csv('data/training_data.csv')
df['category'] = df['category'].str.strip()
df = df.drop_duplicates(subset='text')

X = df["text"]
y = df["category"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

model = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=1,
        max_df=0.95,
        strip_accents='unicode',
        analyzer='word',
    )),
    ('clf', LinearSVC(class_weight='balanced', max_iter=2000, C=1.0))
])

model.fit(X_train, y_train)

cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"Cross-validation accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

y_pred = model.predict(X_test)
print("\nClassification report on held-out test set:")
print(classification_report(y_test, y_pred))

# Refit on the full dataset before saving
model.fit(X, y)

os.makedirs('models', exist_ok=True)
with open('models/classifier.pkl', 'wb') as f:
    pickle.dump(model, f)

test_sentences = [
    "This function stores passwords in plaintext",
    "The loop runs even after the condition is met",
    "Variable names are not descriptive",
    "This iterates the entire list on every call",
    "The API key is hardcoded in the source code",
    "The async function is called without await",
    "Magic number 86400 should be a named constant",
    "The database is queried inside a loop causing N+1 problem",
]

predictions = model.predict(test_sentences)
print("\nSample predictions:")
for sentence, prediction in zip(test_sentences, predictions):
    print(f"  [{prediction}] {sentence}")

print("\nTraining complete")
