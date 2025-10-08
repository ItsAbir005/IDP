from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import joblib

# Initialize Flask app
app = Flask(__name__)

# Load model and scaler
MODEL_PATH = "../Model/fatigue_predictor.h5"
SCALER_PATH = "../Model/scaler.pkl"

model = load_model(MODEL_PATH, compile=False)
scaler = joblib.load(SCALER_PATH)

print("✅ Model & Scaler Loaded Successfully!")

# ------------------------------
# Health Alert Logic
# ------------------------------
def generate_alert(fatigue_score):
    if fatigue_score > 0.8:
        return "⚠️ Critical Fatigue! Immediate rest recommended."
    elif fatigue_score > 0.6:
        return "🟠 High Fatigue. Hydrate or rest soon."
    elif fatigue_score > 0.4:
        return "🟡 Mild Fatigue. Monitor vitals closely."
    else:
        return "🟢 Normal condition."

# ------------------------------
# Predict Route
# ------------------------------
@app.route('/predict', methods=['POST'])
def predict_fatigue():
    try:
        data = request.get_json()

        # Expected input format
        # {
        #   "heart_rate": 85,
        #   "spo2": 97,
        #   "temperature": 37.1,
        #   "steps": 40,
        #   "hydration": 0.76
        # }

        features = np.array([[data['heart_rate'], data['spo2'], data['temperature'],
                              data['steps'], data['hydration']]])
        
        # Scale input
        scaled_features = scaler.transform(features)
        
        # Reshape for LSTM (seq_len=1, features=5)
        scaled_features = np.reshape(scaled_features, (1, 1, 5))
        
        # Predict fatigue risk
        prediction = model.predict(scaled_features)[0][0]
        prediction = float(round(prediction, 2))

        # Generate alert message
        alert_msg = generate_alert(prediction)
        
        return jsonify({
            "fatigue_risk": prediction,
            "alert": alert_msg
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ------------------------------
# Run Server
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)
