import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/login/Login"; // Assume you have this component
import Signup from './components/signup/Signup';
import Homepage from "./components/homepage/Homepage";
import './App.css'; // Your CSS file

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Syntaxx Squad</h1>
          <nav>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
