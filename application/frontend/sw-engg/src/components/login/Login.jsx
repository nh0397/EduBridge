import React, { useEffect, useState } from 'react';
import CryptoJS from "crypto-js";
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import {
  Grid, Paper, Box, Typography, TextField, Button,
  CssBaseline, ThemeProvider, Link, FormControlLabel, Checkbox,
  InputAdornment
} from '@mui/material';
import theme from '../../theme'; 

import logo from '../../images/eduBridge.webp';
import backgroundImage from '../../images/Backgroundimage.png';
import backgroundImage2 from '../../images/Background2.webp';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Import icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container component="main" sx={{ height: '100vh' }}>
    
        {/* Left Side (Login Form) */}
        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square sx={{ backgroundImage: `url(${backgroundImage2})`,      
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', // Adjust to fit the background image as portrait
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column', }}>
          <Box sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Typography component="h1" variant="h3" gutterBottom sx={{ fontFamily: 'AudioWide', fontWeight: 'bold' }}>
              Log in to Your Account
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', '& .MuiTextField-root': { backgroundColor: '#fff' } }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="User ID"
                name="email"
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {requireOtp && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="OTP"
                  type="text"
                  id="otp"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              <Link href="/forgot-password" variant="body2">
                Forgot Password?
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  textTransform: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  fontSize: '20px',
                  padding: '8px 20px',
                }}>
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
    
        {/* Right Side (Logo and Signup CTA) */}
        <Grid item xs={false} sm={4} md={5} sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
    
        <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: theme.spacing(2), borderRadius: '50%', boxShadow: `0px 0px 10px ${theme.palette.secondary.main}` }} />
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'AudioWide', fontWeight: 'bold', color: theme.palette.primary.contrastText }}>
            Elevate Your Learning
            </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.primary.contrastText }}>
          Inspire Your Teaching - Become Part of Our Vision Today.
          </Typography>
          <Button variant="outlined" color="primary" sx={{ mt: 7.95, bgcolor:'#B3CBB4', color: '#FFFFFF', borderColor:'secondary'}} onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
  
  
}

export default Login;

