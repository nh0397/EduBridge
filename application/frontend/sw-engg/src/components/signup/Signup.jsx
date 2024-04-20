import React, { useState } from 'react';
import './Signup.css';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";


function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Check if the email ends with ".edu"
      if (!email.endsWith('.edu')) {
        alert('Please use a .edu email address.');
        return; // Stop the function if the check fails
      }
      if (password != confirmedPassword){
        alert('Passwords do not match! Please retry.');
        return; // Stop the function if the check fails
      }  
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const response = await apiService.signup(firstName,lastName,email, hashedPassword);
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
    <div className='full-container-signup'>

      <div className='welcome-container'>

      </div>

    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="underline"></div>
      <form>
        <div className="form-group">
          <label htmlFor="email">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>

        <div className="register-link">
            <p>Already have an account? Sign in here <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Signup;
