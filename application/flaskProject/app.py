from flask import Flask, jsonify, request
import joblib
import os
import pandas as pd

app = Flask(__name__)

# Load the best model
MODEL_PATH = 'models/best_model.pkl'

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("No trained model found. Please train the model first.")
    return joblib.load(MODEL_PATH)

# Endpoint to train models and store the best one
@app.route('/train', methods=['POST'])
def train_models():
    from train_models import train_and_save_best_model  # Import the training script
    best_model_name, best_f1 = train_and_save_best_model()
    return jsonify({
        'message': 'Model training completed.',
        'best_model': best_model_name,
        'best_f1_score': best_f1
    })

# Endpoint to retrieve the best model
@app.route('/best-model', methods=['GET'])
def get_best_model():
    if not os.path.exists(MODEL_PATH):
        return jsonify({'error': 'No trained model found. Please train the model first.'}), 404

    best_model = load_model()
    return jsonify({'message': 'Best model is ready.', 'model_details': str(best_model)})

@app.route('/predict', methods=['POST'])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({'error': 'No trained model found. Please train the model first.'}), 404

    best_model = load_model()
    try:
        # Parse the JSON payload
        payload = request.get_json()
        if not payload:
            return jsonify({'error': 'Invalid input. Please send JSON data.'}), 400

        # Ensure ParticipantID is fixed to 1
        payload['ParticipantID'] = 1  # Add ParticipantID if missing or overwrite with fixed value

        # Convert payload to DataFrame (assuming input is a single dict)
        input_data = pd.DataFrame([payload])  # Wrap payload in a list to create a DataFrame

        # Log the structure of the input data
        print("\nIncoming Request Data Format:")
        print("Feature Names:", list(input_data.columns))
        print("Sample Data:\n", input_data)

        # Make a prediction
        prediction = best_model.predict(input_data.drop(columns=['ParticipantID']))[0]  # Drop ParticipantID for prediction
        
        return jsonify({
            'prediction': prediction,
            'message': 'Prediction successful'
        })

    except Exception as e:
        return jsonify({'error': f"An error occurred during prediction: {str(e)}"}), 500


if __name__ == '__main__':
    # Ensure the 'models' directory exists
    os.makedirs('models', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)