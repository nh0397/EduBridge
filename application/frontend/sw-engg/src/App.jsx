import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from './components/signup/Signup';
import StudentLandingPage from "./components/Landing/StudentLanding/StudentLandingPage"
import './App.css'; // Your CSS file
import AdminPage from "./components/Landing/Admin/AdminPage";
import InstructorLandingPage from "./components/Landing/InstructorLanding/InstructorLandingPage";
import UploadContentPage from './components/Landing/InstructorLanding/UploadContentPage';
import ProtectedRoute from "./components/routing/ProtectedRoute";
import DiscussionForum from './components/DiscussionForum/DiscussionForum'; // Import the DiscussionForum component
import DiscussionList from './components/DiscussionForum/DiscussionList';
import DiscussionDetail from './components/DiscussionForum/DiscussionDetail';
import StudentRoute from "./components/routing/StudentRoute";
import InstructorRoute from "./components/routing/InstructorRoute";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage/student" element={
            <ProtectedRoute>
              <StudentRoute>
                <StudentLandingPage />
              </StudentRoute>
            </ProtectedRoute>
          } />
          <Route path="/homepage/instructor" element={
            <ProtectedRoute>
              <InstructorRoute>
                <InstructorLandingPage />
              </InstructorRoute>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/upload-content" element={
            <ProtectedRoute>
              <UploadContentPage />
            </ProtectedRoute>
          } />
          <Route path="/forum" element={<DiscussionForum />} />
          <Route path="/discussions" element={<DiscussionList />} />
          <Route path="/discussion/:id" element={<DiscussionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
