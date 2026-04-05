from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle


with open('models/classifier.pkl', 'rb') as f:
  model = pickle.load(f)

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST'])
def classify():
  body = request.get_json()
  text = body['text']
  prediction = model.predict([text])
  
  return jsonify({"category": prediction[0]})

if __name__ == '__main__':
  app.run(port=5001)