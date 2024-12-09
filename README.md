# Emotion Detection and Advanced Personalization in Learning Management System

## Project Description
This project focuses on making Learning Management Systems (LMS) more human and empathetic by integrating emotion detection and personalization. Instead of just measuring students by their grades, we want to understand how they feel—whether they’re stressed, frustrated, or motivated—while doing tasks like assignments or tests.

The goal is to build a proof of concept that captures these emotional cues using tools and services integrated into a low-code/no-code platform. This makes it easier to develop, scale, and add to existing systems.

By recognizing and responding to students’ emotions in real-time, this project aims to help students stay engaged, support their well-being, and improve their learning experience overall.



## Technical Problems

### Functional Requirements
- **Textual Data Analysis**: Process textual inputs, including sentiment analysis of assignments, discussion posts, and messages, to detect emotions like stress, frustration, or engagement.
- **Video Analysis for Emotion Detection**: Use facial emotion recognition from real-time video streams and recorded sessions to identify key emotional states.
- **Consent Management**: Enable students to opt-in or opt-out of emotion tracking, ensuring their choices are respected.

### Non-Functional Requirements
- **Performance**: Real-time emotion detection and response within 2 seconds for a seamless user experience.



## Future Directions/Research

### Functional Requirements
- **Adaptive Learning**: Adjust difficulty level, pacing, and supplemental resources based on emotional feedback.
- **Instructor Dashboard**: Provide real-time emotional trends and insights for instructors.
- **Alert System**: Notify instructors of students facing prolonged emotional distress.
- **Behavioral Metrics Analysis**: Track typing speed, task-switching, and study session durations for engagement insights.
- **Emotional State History**: Visualize emotional state trends over time.
- **Privacy and Security**: Enhance encryption methods and anonymization techniques.
- **Device Compatibility**: Optimize for a wider range of devices.

### Non-Functional Requirements
- **Scalability**: Handle large-scale classes with hundreds of students.
- **Cultural Sensitivity**: Minimize biases in emotion detection models.
- **Advanced Integration**: Merge textual, video, and behavioral emotional data.
- **Usability Enhancements**: Simplify interfaces for ease of use.



## Technical Solutions

### Textual Data Analysis

#### Data Collection
Metrics collected include:
- Time Elapsed
- Time Paused
- Typing Speed
- Total Words Typed
- Total Error Corrections
- Total Tab Switches

#### Model Training and Selection
Models trained:
- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- Naive Bayes

#### Deployment
- **Model Deployment**: Flask API for real-time predictions.
- **Retraining Capability**: Endpoint for on-demand retraining.
- **Scalability**: Optimized backend for concurrent requests.

### Video Data Analysis

#### Data Collection
Used real-time video data to identify emotions (e.g., anger, surprise, neutrality).

#### Model and Framework
- **Tool**: face-api.js for real-time facial analysis.
- **Emotions Detected**: Angry, Disgusted, Fearful, Happy, Neutral, Sad, Surprised.

#### Deployment
- Integrated face-api.js into the frontend for in-browser processing.
- Real-time communication with WebSockets for frequent updates.



## Potential Customers and Use Cases

| **Industry Domain**    | **Particular Client**            | **Client's Use Case**                                                                 | **How This Integration Can Help**                                                         |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Education              | Community Schools & Universities | Detect stress, disengagement, or frustration during online classes, assignments, etc. | Provides real-time emotional insights for personalized learning and timely interventions. |
| Corporate Training     | Multinational Corporations       | Track engagement during onboarding or skill enhancement programs.                     | Adjusts training content dynamically to improve retention.                                |
| Healthcare             | Telemedicine Platforms           | Analyze patient emotions during virtual consultations.                                | Enhances mental health care through real-time emotional insights.                         |
| Entertainment & Gaming | Game Developers                  | Detect frustration or excitement during gameplay.                                     | Adjusts game mechanics dynamically for personalized experiences.                          |



## Relevance for AI Entrepreneurship Course
This project exemplifies leveraging advanced technologies like emotion detection and adaptive systems to solve modern problems. Using existing tools, APIs, and frameworks, the project emphasizes accessibility and innovation through low-code/no-code platforms.



## Technologies Used
- **Frontend**: React
- **Backend**: Node.js, Express, Flask
- **Database**: MySQL
- **CMS**: Directus
- **Email Service**: Nodemailer
- **Deployment**: AWS EC2, Netlify
- **Domain Management**: DuckDNS
- **Web Server and SSL**: Nginx, Certbot


# API Endpoints

## Backend (Node.js + Express)

### User Management

#### Register User
- **Endpoint**: `/api/register`
- **Method**: POST
- **Description**: Registers a new user.

#### Login User
- **Endpoint**: `/api/login`
- **Method**: POST
- **Description**: Authenticates a user and returns a token.

#### Get User Profile
- **Endpoint**: `/api/user/profile`
- **Method**: GET
- **Description**: Retrieves the profile of the logged-in user.



### Course Management

#### Create Course
- **Endpoint**: `/api/courses`
- **Method**: POST
- **Description**: Creates a new course.

#### Get All Courses
- **Endpoint**: `/api/courses`
- **Method**: GET
- **Description**: Retrieves all courses.

#### Get Course by ID
- **Endpoint**: `/api/courses/:id`
- **Method**: GET
- **Description**: Retrieves a course by its ID.

#### Update Course
- **Endpoint**: `/api/courses/:id`
- **Method**: PUT
- **Description**: Updates a course by its ID.

#### Delete Course
- **Endpoint**: `/api/courses/:id`
- **Method**: DELETE
- **Description**: Deletes a course by its ID.



### Content Management

#### Upload Content
- **Endpoint**: `/api/content/upload`
- **Method**: POST
- **Description**: Uploads content for a course.

#### Get Content by Course ID
- **Endpoint**: `/api/content/:courseId`
- **Method**: GET
- **Description**: Retrieves content for a specific course.



### Emotion Detection

#### Predict Emotion
- **Endpoint**: `/api/emotion/predict`
- **Method**: POST
- **Description**: Predicts the emotional state based on user interaction metrics.



## Flask Project

### Model Training and Prediction

#### Train Model
- **Endpoint**: `/train`
- **Method**: POST
- **Description**: Trains new models and stores the best one.

#### Get Best Model
- **Endpoint**: `/best-model`
- **Method**: GET
- **Description**: Retrieves details of the best trained model.

#### Make Prediction
- **Endpoint**: `/predict`
- **Method**: POST
- **Description**: Makes a prediction using the best trained model.



### File Upload

#### Upload PDF
- **Endpoint**: `/upload-pdf`
- **Method**: POST
- **Description**: Uploads a PDF and extracts its text content.



### Chatbot

#### Chatbot Interaction
- **Endpoint**: `/chatbot`
- **Method**: POST
- **Description**: Handles chatbot requests based on the uploaded PDF content.



### Emotion Monitoring

#### Start Emotion Monitoring
- **Endpoint**: `/start-emotion-monitoring`
- **Method**: POST
- **Description**: Starts emotion monitoring.



## Frontend (React)

### User Interface

- **Home Page**: Displays the homepage of the web application.
- **Login Page**: Allows users to log in.
- **Register Page**: Allows users to register.
- **Dashboard**: Displays the user dashboard with courses and content.
- **Course Page**: Displays details of a specific course.
- **Upload Page**: Allows instructors to upload content.
- **Chatbot Page**: Allows users to interact with the chatbot.



### Components

- **Header**: Displays the navigation bar.
- **Footer**: Displays the footer.
- **CourseCard**: Displays a card for each course.
- **ContentList**: Displays a list of content for a course.
- **EmotionDetector**: Integrates face-api.js for real-time emotion detection.



## Project Structure

```sh
.DS_Store
.github/
    workflows/
        backend-tests.yml
.gitignore
application/
    backend/
        .env
        docker-compose.yml
        package.json
        routes/
        server.js
        Services/
        tests/
        testServer.js
    flaskProject/
        __pycache__/
        .env
        app.py
        context/
        data/
        models/
        requirements.txt
        static/
        templates/
        train_models.py
        venv/
    frontend/
        package.json
        sw-engg/
    Participant Data.xlsx
    README.md
Milestones/
    M0/
        README.md
    M1/
        M1 Submission Form.docx
        ...
    M2/
    M3/
    M4/
    M5/
README.md
```

### Setup and Deployment

#### Backend Integration
1. Install dependencies in the backend directory.
```sh
cd application/backend
npm install
```
2. Start the backend server.
```sh
npm start
```

#### Flask Project
1. Setup a virtual environment in the `flaskProject` directory.
2. Install required Python packages.
3. Start the Flask server.
```sh
cd application/flaskProject
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

#### Frontend Deployment
1. Install dependencies in the frontend directory.
```sh
pip install -r requirements.txt
```
2. Start the frontend server.
```
flask run
```

#### Domain and SSL Setup
- Use DuckDNS for domain management.
- Set up SSL certificates with Certbot and Nginx.

### Security
- **Data Encryption**: Encrypt sensitive data.
- **Access Control**: Implement role-based access control.
- **Privacy**: Ensure data anonymization and respect user consent.



## Team
- **Naisarg**
- **Parth**



## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit changes: `git commit -m 'Add new feature'`.
4. Push the branch: `git push origin feature-branch`.
5. Open a Pull Request.



## License
This project is licensed under the MIT License. See the LICENSE file for details.
