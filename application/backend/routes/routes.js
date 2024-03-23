const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../database'); // Assuming you've set up the database pool
const { sendOtpEmail } = require('../emailService'); 

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Welcome to the Syntaxx Squad API!');
  });
// Signup endpoint
router.post('/signup', (req, res) => {
  const { email, password } = req.body; // Assuming the password is already hashed
  const is_authenticated = false;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP as a string

  // First, check if the user already exists
  pool.query('SELECT * FROM users WHERE user_email = ?', [email], (error, results) => {
      if (error) {
          console.error('Error checking user existence:', error);
          return res.status(500).json({ success: false, message: 'Error checking user existence' });
      }

      if (results.length > 0) {
          // User already exists
          return res.status(409).json({ success: false, message: 'Email is already in use' });
      } else {
          // User does not exist, first try to send OTP email
          sendOtpEmail(email, otp).then(() => {
              // Email sent successfully, now insert the user into the database
              const query = 'INSERT INTO users (user_email, user_password, is_authenticated, otp) VALUES (?, ?, ?, ?)';

              pool.query(query, [email, password, is_authenticated, otp], (error) => {
                  if (error) {
                      console.error('Signup error:', error);
                      return res.status(500).json({ success: false, message: 'Error registering new user' });
                  } else {
                      return res.json({ success: true, message: 'Signup successful, please check your email for OTP' });
                  }
              });
          }).catch((error) => {
              // Failed to send OTP email
              console.error('Error sending OTP email:', error);
              return res.status(500).json({ success: false, message: 'Signup successful, but failed to send OTP email' });
          });
      }
  });
});

  
// Login endpoint
router.post('/login', (req, res) => {
    const { email, password: hashedPassword, otp } = req.body; // Assuming otp might be sent

    pool.query('SELECT * FROM users WHERE user_email = ?', [email], (error, results) => {
        if (error) {
            console.error('Login error:', error);
            return res.status(500).json({ success: false, message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];

        if (user.user_password === hashedPassword) {
            if (!user.is_authenticated) {
                // User is not authenticated; OTP verification is required
                return res.status(403).json({ success: false, message: 'OTP verification required' });
            } else {
                // Passwords match and user is authenticated
                res.json({ success: true, message: 'Login successful' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

router.post('/verify-otp', (req, res) => {
  const { email, hashedPassword, otp } = req.body; // Assuming the frontend sends the password hashed

  // Query the database for the user
  pool.query('SELECT * FROM users WHERE user_email = ?', [email], (error, results) => {
      if (error) {
          console.error('Error fetching user:', error);
          return res.status(500).json({ success: false, message: 'Error fetching user' });
      }

      if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = results[0];

      // Check if the hashed passwords match and OTP is correct
      if (user.user_password === hashedPassword && user.otp === otp) {
          // Update is_authenticated to 1
          pool.query('UPDATE users SET is_authenticated = 1 WHERE user_email = ?', [email], (error, results) => {
              if (error) {
                  console.error('Error updating user authentication status:', error);
                  return res.status(500).json({ success: false, message: 'Error updating user authentication status' });
              }
              return res.json({ success: true, message: 'OTP verification successful' });
          });
      } else {
          return res.status(401).json({ success: false, message: 'Invalid credentials or OTP' });
      }
  });
});


router.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
          return res.status(500).json({ success: false, message: 'Error retrieving users' });
      }
      res.json({ success: true, data: results });
  });
});

// Export the router
module.exports = router;
