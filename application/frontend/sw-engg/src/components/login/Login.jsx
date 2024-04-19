import React, { useEffect, useState } from 'react';
import CryptoJS from "crypto-js";
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import './Login.css';

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
      localStorage.setItem('userEmail', email);
      // Fetch user role after successful login
      const roleResponse = await apiService.fetchUserRole(email);
      const role = roleResponse[0].role; // Ensure the role is directly accessible


      const firstNameResponse = await apiService.fetchUserFirstName(email);
      const firstName = firstNameResponse.data.data[0].first_name;


      sessionStorage.setItem('firstName', firstName);



      // Store the role in session storage
      sessionStorage.setItem('role', role.toLowerCase());

      // Redirect based on user role
      switch (role.toLowerCase()) {
        case 'student':
          navigate('/student');
          break;
        case 'instructor':
          navigate('/instructor');
          break;
        case 'administrator':
          navigate('/admin');
          break;
        default:
          navigate('/');
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



  return (
      <div className='full-container-login'>
        <div className='welcomeback-container'></div>
        <div className="login-container">
          <h2>Login</h2>
          <div className="underline"></div>
          <form onSubmit={handleSubmit}>
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
            <div className="forgot-password-link">
              <p>Forgot your password? <a href="/forgot-password">Reset it</a></p>
            </div>
            <button type="submit" disabled={isLoggingIn}>Login</button>
            <div className="register-link">
              <p>Don't have an account? <a href="/signup">Register</a></p>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Login;
