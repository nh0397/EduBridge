from flask import Flask, jsonify, request, render_template
import joblib
import os
import pandas as pd
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

# Load the best model
MODEL_PATH = "models/best_model.pkl"


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("No trained model found. Please train the model first.")
    return joblib.load(MODEL_PATH)


# Endpoint to train models and store the best one
@app.route("/train", methods=["POST"])
def train_models():
    from train_models import train_and_save_best_model  # Import the training script

    best_model_name, best_f1 = train_and_save_best_model()
    return jsonify(
        {
            "message": "Model training completed.",
            "best_model": best_model_name,
            "best_f1_score": best_f1,
        }
    )


# Endpoint to retrieve the best model
@app.route("/best-model", methods=["GET"])
def get_best_model():
    if not os.path.exists(MODEL_PATH):
        return (
            jsonify({"error": "No trained model found. Please train the model first."}),
            404,
        )

    best_model = load_model()
    return jsonify(
        {"message": "Best model is ready.", "model_details": str(best_model)}
    )


@app.route("/predict", methods=["POST"])
def predict():
    if not os.path.exists(MODEL_PATH):
        return (
            jsonify({"error": "No trained model found. Please train the model first."}),
            404,
        )

    best_model = load_model()
    try:
        # Parse the JSON payload
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Invalid input. Please send JSON data."}), 400

        # Ensure ParticipantID is fixed to 1
        payload["ParticipantID"] = (
            1  # Add ParticipantID if missing or overwrite with fixed value
        )

        # Convert payload to DataFrame (assuming input is a single dict)
        input_data = pd.DataFrame(
            [payload]
        )  # Wrap payload in a list to create a DataFrame

        # Log the structure of the input data
        print("\nIncoming Request Data Format:")
        print("Feature Names:", list(input_data.columns))
        print("Sample Data:\n", input_data)

        # Make a prediction
        prediction = best_model.predict(input_data.drop(columns=["ParticipantID"]))[
            0
        ]  # Drop ParticipantID for prediction

        return jsonify({"prediction": prediction, "message": "Prediction successful"})

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500


# Home route
@app.route("/")
def home():
    print("SERVER STARTED")
    return render_template("index.html")


# SocketIO event handlers
@socketio.on("connect")
def test_connect():
    print("SOCKET CONNECTED")


@socketio.on("my event")
def handle_my_custom_event(json, methods=["GET", "POST"]):
    print("received my event: " + str(json))


# Endpoint to start emotion monitoring
@app.route("/start-emotion-monitoring", methods=["POST"])
def start_emotion_monitoring():
    # Logic to start emotion monitoring
    return jsonify({"message": "Emotion monitoring started"})


# Endpoint to stop emotion monitoring
@app.route("/stop-emotion-monitoring", methods=["POST"])
def stop_emotion_monitoring():
    # Logic to stop emotion monitoring
    return jsonify({"message": "Emotion monitoring stopped"})


# SocketIO event handler for emotion data
@socketio.on("emotion data")
def handle_emotion_data(json, methods=["GET", "POST"]):
    print("received emotion data: " + str(json))


@app.route("/emotion-data", methods=["POST"])
def emotion_data():
    try:
        data = request.get_json()
        # Process the data to extract emotional state
        if "expressions" in data:
            expressions = data["expressions"]
            # Find the emotion with the highest probability
            dominant_emotion = max(expressions, key=expressions.get)
            return jsonify(
                {
                    "message": "Emotion data received successfully",
                    "dominant_emotion": dominant_emotion,
                    "expressions": expressions,
                }
            )
        else:
            return jsonify({"error": "No expressions data found"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    # Ensure the 'models' directory exists
    os.makedirs("models", exist_ok=True)
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
