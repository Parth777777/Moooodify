from flask import Flask, request, jsonify
import base64
import re
import cv2
import numpy as np
from flask_cors import CORS
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    image_b64 = re.sub("^data:image/.+;base64,", "", data["image"])
    image_bytes = base64.b64decode(image_b64)

    # Convert bytes → numpy array → OpenCV image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Analyze emotion with DeepFace
    try:
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        dominant_emotion = result[0]['dominant_emotion']
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"emotion": dominant_emotion})


if __name__ == "__main__":
    app.run(host='0.0.0.0' , port=10000)

