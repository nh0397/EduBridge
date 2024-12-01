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
    # Load the Excel file
    data = pd.read_excel('data/data.xlsx')  # Replace with your dataset path
    print("Data loaded successfully.")

    # Features and target
    X = data.drop(columns=['classLabel','participantName','assignmentID'])  # Replace 'target' with the actual target column name
    y = data['classLabel']  # Replace 'target' with the actual target column name
    return train_test_split(X, y, test_size=0.2, random_state=42)

# Step 2: Train models and select the best one
def train_and_save_best_model():
    X_train, X_test, y_train, y_test = load_data()

    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'Random Forest': RandomForestClassifier(random_state=42),
        'Support Vector Machine': SVC(probability=True, random_state=42),
        'K-Nearest Neighbors': KNeighborsClassifier(),
        'Naive Bayes': GaussianNB()
    }

    best_model = None
    best_f1 = 0
    best_model_name = None

    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        f1 = f1_score(y_test, y_pred, average='weighted')
        print(f"{model_name}: F1 Score = {f1:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_model_name = model_name

    print(f"\nBest Model: {best_model_name} with F1 Score = {best_f1:.4f}")

    # Save the best model
    joblib.dump(best_model, 'models/best_model.pkl')
    print(f"Best model saved to 'models/best_model.pkl'.")

    return best_model_name, best_f1
