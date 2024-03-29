const express = require('express');
const  CryptoJS  = require("crypto-js");
const multer = require('multer'); // Using multer for file uploads
const FormData = require('form-data');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Services section
const pool = require('../Services/database'); // Assuming you've set up the database pool
const { sendOtpEmail } = require('../Services/emailService'); 
const { directusClient, pingDirectus } = require('../Services/directus');


const router = express.Router();

// Ping Directus to test connectivity
pingDirectus();

router.get('/', async (req, res) => {
    res.send('Welcome to the Syntaxx Squad API!');
  });


// Signup endpoint
    router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body; // Assuming the password is already hashed
    const is_authenticated = false;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP as a string

    // First, check if the user already exists
    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error checking user existence:', error);
            return res.status(500).json({ success: false, message: 'Error checking user existence' });
        }

        if (results.length > 0) {
            // User already exists
            return res.status(409).json({ success: false, message: 'Email is already in use' });
        } else {
            // User does not exist, first try to send OTP email
            sendOtpEmail(firstName, email, otp).then(() => {
                // Email sent successfully, now insert the user into the database
                const query = 'INSERT INTO users (first_name, last_name, email, password, is_authenticated, otp) VALUES (?, ?, ?, ?, ?, ?)';

                pool.query(query, [firstName, lastName, email, password, is_authenticated, otp], (error) => {
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

    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Login error:', error);
            return res.status(500).json({ success: false, message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];

        if (user.password === hashedPassword) {
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
    const { email, otp, firstName, lastName, hashedPassword } = req.body; // Assume these are provided in the request
  
    pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ success: false, message: 'Error fetching user' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const user = results[0];
  
      // Assuming you're comparing the hashed password stored in your database
      if (user.password === hashedPassword && user.otp === otp) {
        try {
          pool.query('Update users set is_authenticated = 1 WHERE email = ?', [email], async (error, results) => {
            if (error) {
              console.error('Error authenticating user', error);
              return res.status(500).json({ success: false, message: 'Error authenticating user' });
            }
            else{
              console.log("User authentication was successful")
            }
          })
          // Use the Directus client to create a new user in Directus
          const directusResponse = await directusClient.post('/users', {
            email: email,
            password: user.first_name+'123', // Send the plain password for Directus to hash
            first_name: user.first_name,
            last_name: user.last_name,
          });
  
          // Optionally, update anything else in your database post-creation in Directus
  
          return res.json({ success: true, message: 'OTP verification successful, user added to Directus', data: directusResponse.data });
        } catch (directusError) {
          console.error('Error adding user to Directus:', directusError);
          return res.status(500).json({ success: false, message: 'Failed to add user to Directus' });
        }
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

router.post('/upload', upload.single('file'), async (req, res) => {
  const { folderId } = req.query; // Extract folderId from the URL parameter
  const file = req.file; // The uploaded file

  try {
    // Step 1: Upload the file to Directus
    let formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    
    const uploadResponse = await directusClient.post('/files', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const fileId = uploadResponse.data.data.id; // Assuming Directus response structure

    // Step 2: Update the file's metadata to assign it to the folder
    if (folderId) {
      await directusClient.patch(`/files/${fileId}`, {
        folder: folderId,
      });
    }

    // Respond with success
    res.json({ success: true, message: 'File uploaded and folder assigned successfully', data: uploadResponse.data });
  } catch (error) {
    console.error('Error handling file upload to Directus:', error);
    res.status(500).json({ message: 'Failed to upload file to Directus and assign to folder' });
  }
});


router.get('/folders', async (req, res) => {
  try {
      const response = await directusClient.get('/folders');
      res.json(response.data);
  } catch (error) {
      console.error('Failed to fetch folders from Directus:', error);
      res.status(500).json({ message: 'Failed to fetch folders from Directus' });
  }
});

// Export the router
module.exports = router;




