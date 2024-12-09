import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
import joblib  # For saving the model


# Step 1: Load and preprocess the data
def load_data():
    """
    Load and preprocess the dataset.

    This function loads an Excel dataset, separates features and target labels,
    and splits the data into training and testing sets.

    Args:
        file_path (str): Path to the dataset (Excel file). Default is 'data/data.xlsx'.

    Returns:
        tuple: Split data (X_train, X_test, y_train, y_test).
    """
    # Load the Excel file
    file_path = "data/data.xlsx"
    data = pd.read_excel(file_path)
    print("Data loaded successfully.")

    # Features and target
    X = data.drop(
        columns=["classLabel", "participantName", "assignmentID"]
    )  # Replace 'classLabel' with actual target column name
    y = data["classLabel"]  # Replace 'classLabel' with actual target column name

    # Split the data into training and testing sets (80% train, 20% test)
    return train_test_split(X, y, test_size=0.2, random_state=42)


# Step 2: Train models and select the best one
def train_and_save_best_model():
    """
    Train various models and select the best one based on F1 score.

    This function trains multiple classification models, evaluates them using the
    weighted F1 score, and selects the model with the highest F1 score. The best
    model is then saved to disk.

    Returns:
        tuple: Name of the best model and its F1 score.
    """
    # Load the data and split into training and test sets
    X_train, X_test, y_train, y_test = load_data()

    # Define models to train
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42),
        "Support Vector Machine": SVC(probability=True, random_state=42),
        "K-Nearest Neighbors": KNeighborsClassifier(),
        "Naive Bayes": GaussianNB(),
    }

    best_model = None
    best_f1 = 0
    best_model_name = None

    # Train and evaluate each model
    for model_name, model in models.items():
        # Fit the model to training data
        model.fit(X_train, y_train)

        # Make predictions on the test set
        y_pred = model.predict(X_test)

        # Calculate the F1 score (weighted for class imbalance)
        f1 = f1_score(y_test, y_pred, average="weighted")
        print(f"{model_name}: F1 Score = {f1:.4f}")

        # Update the best model if the current model has a higher F1 score
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_model_name = model_name

    print(f"\nBest Model: {best_model_name} with F1 Score = {best_f1:.4f}")

    # Save the best model to disk
    joblib.dump(best_model, "models/best_model.pkl")
    print(f"Best model saved to 'models/best_model.pkl'.")

    # Return the name and F1 score of the best model
    return best_model_name, best_f1
