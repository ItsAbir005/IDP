from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
import os
app = Flask(__name__, static_folder='health-dashboard-vite/dist', static_url_path='')

MODEL_PATH = 'xgboost_uv_risk.joblib'
SCALER_PATH = 'scaler_reduced.joblib'
LABEL_ENCODER_UV_RISK_PATH = 'label_encoder.joblib'
MULTI_OUTPUT_MODEL_PATH = 'multioutput_model.joblib'
MULTI_LABEL_ENCODERS_PATH = 'label_encoder_1.joblib'
SLEEP_MULTI_OUTPUT_MODEL_PATH = 'multioutput_sleep_model.joblib'
SLEEP_LABEL_ENCODERS_PATH = 'sleep_label_encoders.joblib'

# CORS is generally not needed if Flask is serving both frontend and backend from the same origin.
# You can remove or comment this out for production deployment if your frontend is served by Flask.
# If you have other client applications (e.g., mobile app) that need to access this API, keep CORS.
CORS(app) # Keeping it active for dev, but consider removing for single-origin production.

# Load models and scalers
try:
    uv_risk_model = joblib.load(MODEL_PATH)
    shared_scaler = joblib.load(SCALER_PATH)
    uv_risk_le = joblib.load(LABEL_ENCODER_UV_RISK_PATH)
    multioutput_model = joblib.load(MULTI_OUTPUT_MODEL_PATH)
    multi_health_risk_les = joblib.load(MULTI_LABEL_ENCODERS_PATH)
    sleep_multioutput_model = joblib.load(SLEEP_MULTI_OUTPUT_MODEL_PATH)
    sleep_label_encoders_dict = joblib.load(SLEEP_LABEL_ENCODERS_PATH)
    print("All models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    uv_risk_model = None
    shared_scaler = None
    uv_risk_le = None
    multioutput_model = None
    multi_health_risk_les = None
    sleep_multioutput_model = None
    sleep_label_encoders_dict = None

# Route to serve the React frontend's index.html and other static files.
# This is crucial for single-page applications.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    file_path = os.path.join(app.static_folder, path)
    
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    
    return send_from_directory(app.static_folder, 'index.html')


# --- API Endpoints ---
# IMPORTANT: Added '/api' prefix to all API routes
@app.route('/api/predict_uv_risk', methods=['POST'])
def predict_uv_risk():
    if uv_risk_model is None or shared_scaler is None or uv_risk_le is None:
        return jsonify({"error": "UV Risk model, scaler, or label encoder not loaded. Check server logs."}), 500
    try:
        data = request.get_json()
        required_features = shared_scaler.feature_names_in_
        input_data = {}
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature: {feature}"}), 400
            input_data[feature] = data[feature]
        
        sample_df_original = pd.DataFrame([input_data])
        sample_scaled = shared_scaler.transform(sample_df_original[required_features])
        sample_pred_encoded = uv_risk_model.predict(sample_scaled)
        
        predicted_level_decoded = uv_risk_le.inverse_transform(sample_pred_encoded.astype(int))
        predicted_level = str(predicted_level_decoded[0])
        return jsonify({"predicted_uv_risk_level": predicted_level}), 200
    except Exception as e:
        print(f"Error in predict_uv_risk: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict_health_risk', methods=['POST'])
def predict_health_risk():
    if multioutput_model is None or multi_health_risk_les is None:
        return jsonify({"error": "Multioutput model or multi-label encoders not loaded. Check server logs."}), 500
    try:
        data = request.get_json()
        required_features = [
            'Heart Rate (bpm)',
            'SpO2 Level (%)',
            'Systolic Blood Pressure (mmHg)',
            'Diastolic Blood Pressure (mmHg)',
            'Body Temperature (°C)',
            'Fall Detection'
        ]
        targets_order = [
            'Heart Rate Alert',
            'SpO2 Level Alert',
            'Blood Pressure Alert',
            'Temperature Alert'
        ]
        input_data = {}
        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature: {feature}"}), 400
            input_data[feature] = data[feature]

        if 'Fall Detection' in input_data:
            input_data['Fall Detection'] = 1 if str(input_data['Fall Detection']).lower() == 'yes' else 0

        sample_df_original = pd.DataFrame([input_data])
        sample_pred_encoded = multioutput_model.predict(sample_df_original[required_features])

        single_sample_predictions_encoded = sample_pred_encoded[0].astype(int)
        predicted_levels_decoded = {}
        for i, target_col in enumerate(targets_order):
            encoded_value = single_sample_predictions_encoded[i]
            specific_le = multi_health_risk_les[target_col]
            decoded_value = str(specific_le.inverse_transform([encoded_value])[0])
            predicted_levels_decoded[target_col] = decoded_value
        return jsonify({"predicted_health_risk_levels": predicted_levels_decoded}), 200
    except Exception as e:
        print(f"Error in predict_health_risk: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict_sleep_metrics', methods=['POST'])
def predict_sleep_metrics():
    if sleep_multioutput_model is None or sleep_label_encoders_dict is None:
        return jsonify({"error": "Sleep prediction model or label encoders not loaded. Check server logs."}), 500

    try:
        data = request.get_json()

        required_sleep_features = [
            'Sleep Duration',
            'Quality of Sleep',
            'Physical Activity Level'
        ]

        sleep_targets_order = [
            'Sleep Quality Category',
            'Sleep Alert'
        ]

        input_data = {}
        for feature in required_sleep_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature for sleep prediction: {feature}"}), 400
            input_data[feature] = data[feature]

        sample_df_sleep_original = pd.DataFrame([input_data])
        sleep_predictions_encoded = sleep_multioutput_model.predict(sample_df_sleep_original[required_sleep_features])

        single_sample_sleep_predictions_encoded = sleep_predictions_encoded[0].astype(int)

        predicted_sleep_metrics_decoded = {}
        for i, target_col in enumerate(sleep_targets_order):
            encoded_value = single_sample_sleep_predictions_encoded[i]
            specific_sleep_le = sleep_label_encoders_dict[target_col]
            decoded_value = str(specific_sleep_le.inverse_transform([encoded_value])[0])
            predicted_sleep_metrics_decoded[target_col] = decoded_value

        return jsonify({"predicted_sleep_metrics": predicted_sleep_metrics_decoded}), 200

    except Exception as e:
        print(f"Error in predict_sleep_metrics: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
