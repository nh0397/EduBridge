import React, { useEffect, useState } from 'react';
import CryptoJS from "crypto-js";
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import './Login.css'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requireOtp, setRequireOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setRequireOtp(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      let response;
      if (requireOtp) {
        response = await apiService.loginWithOtp(email, hashedPassword, otp);
      } else {
        response = await apiService.login(email, hashedPassword);
      }

      console.log('Login successful:', response.data);
      sessionStorage.setItem('isAuthenticated', 'true');
      alert('Login successful!');

      // Fetch user role after successful login
      const roleResponse = await apiService.fetchUserRole(email);
      const role = roleResponse[0].role;

      // Redirect based on user role
      if (role.toLowerCase() === 'student') {
        sessionStorage.setItem('isStudent', 'true');
        navigate('/homepage/student');
      } else if (role.toLowerCase() === 'instructor') {
        sessionStorage.setItem('isInstructor', 'true');
        navigate('/homepage/instructor');
      } else {
        // Handle other roles or unexpected cases
        navigate('/homepage');
      }

      setIsLoggingIn(false);
    } catch (error) {
      if (error.response?.data?.message === 'OTP verification required') {
        setRequireOtp(true);
        setIsLoggingIn(false);
        alert('Please enter the OTP sent to your email.');
        return;
      }
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
      setIsLoggingIn(false);
    }
  };

  // Redirect logged-in users to homepage if they try to access the login page
  useEffect(() => {
    // Add any logic here if needed
  }, []);

  return (
    <div className='full-container-login'>
      <div className='welcomeback-container'>
        <h10>Welcome back! 👋</h10>
        <p>We're thrilled to have you back on our platform. Dive back into your learning journey with ease. Whether it's accessing your saved materials, continuing a course, or exploring new content, we're here to support your educational goals every step of the way!</p>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <div className="underline"></div>
        <form>
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
          {requireOtp && (
            <div className="form-group">
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
              />
            </div>
          )}
          <button type="submit" onClick={handleSubmit} disabled={isLoggingIn}>Login</button>
          <div className="register-link">
              <p>Don't have an account? <a href="/signup">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
