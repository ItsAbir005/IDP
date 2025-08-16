import joblib
import numpy as np
from flask import Flask, request, jsonify, render_template

# --- 1. Initialize Flask App ---
app = Flask(__name__)

# --- 2. Load the serialized objects once on app startup ---
try:
    scaler = joblib.load('scaler.joblib')
    label_encoder = joblib.load('label_encoder.joblib')
    alert_model = joblib.load('alert_model.joblib')
    print("All models and processors loaded successfully.")
except FileNotFoundError as e:
    print(f"Error: {e}. Please ensure all .joblib files are in the same directory.")
    exit()

# --- 3. Define the frontend route ---
@app.route('/')
def home():
    """Serves the main HTML page for the frontend."""
    return render_template('index.html')

# --- 4. Define the prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    This endpoint accepts a POST request with new data,
    makes a prediction, and returns the result as JSON.
    """
    try:
        data = request.get_json(force=True)
        input_data = np.array(data['input_data'])

        # --- Use the loaded objects to preprocess and predict ---
        # 1. Scale the input data (6 features)
        scaled_data = scaler.transform(input_data)

        # 2. Slice the data to match the model's expected 5 features
        model_input = scaled_data[:, :-1]

        # 3. Make a prediction using the alert model (5 features)
        predictions_encoded = alert_model.predict(model_input)

        # 4. Decode the numerical prediction back to a human-readable label
        predictions_decoded = label_encoder.inverse_transform(predictions_encoded.flatten())

        # Prepare and return the JSON response
        response = {'prediction': predictions_decoded.tolist()}
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- 5. Run the Flask application ---
if __name__ == '__main__':
    app.run(port=5000, debug=True)