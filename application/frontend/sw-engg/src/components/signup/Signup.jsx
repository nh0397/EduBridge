import React, { useState } from 'react';
import './Signup.css';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Login from '../login/Login';
import CryptoJS from "crypto-js";


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Check if the email ends with ".edu"
      if (!email.endsWith('.edu')) {
        alert('Please use a .edu email address.');
        return; // Stop the function if the check fails
      }  
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const response = await apiService.signup(email, hashedPassword);
      // Handle the response from the server
      console.log(response.data);
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      // Handle any errors
      console.error('Signup error:', error);
      if (error.response.data.message =="Email is already in use"){
        alert('Email already in use. Please login!')
        navigate('/login');
      }else {
        alert('Signup failed.');
      }
    }
  };


  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
