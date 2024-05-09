const express = require("express");
const CryptoJS = require("crypto-js");
const multer = require("multer"); // Using multer for file uploads
const FormData = require("form-data");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Services section
const pool = require("../Services/database"); // Assuming you've set up the database pool
const { sendOtpEmail } = require("../Services/emailService");
const { directusClient, pingDirectus } = require("../Services/directus");

const router = express.Router();

// Ping Directus to test connectivity
pingDirectus();

router.get("/", async (req, res) => {
  res.send("Welcome to the Syntaxx Squad API!");
});



// Endpoint to handle forgot password request
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {

      return res.status(200).json({ message: "If the email is registered, you will receive a password reset email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(users[0].first_name, email, otp);

    await pool.query("UPDATE users SET otp = ? WHERE email = ?", [otp, email]);

    res.json({ message: "If the email is registered, you will receive a password reset email." });
  } catch (error) {
    console.error("Error in requesting password reset:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
});

// Endpoint to verify OTP and reset password
router.post('/reset-password-with-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];
    if (user.otp === otp) {

      const hashedPassword = CryptoJS.SHA256(newPassword).toString();
      await pool.query("UPDATE users SET password = ?, otp = NULL, is_authenticated = 1 WHERE email = ?", [hashedPassword, email]);

      res.json({ message: "Your password has been reset successfully." });
    } else {
      res.status(401).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "An error occurred while resetting your password." });
  }
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const is_authenticated = false;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already in use" });
    }

    await sendOtpEmail(firstName, email, otp);
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, is_authenticated, otp) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, password, is_authenticated, otp]
    );

    res.json({
      success: true,
      message: "Signup successful, please check your email for OTP",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error registering new user" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = results[0];
    if (user.password === password) {
      if (!user.is_authenticated) {
        return res
          .status(403)
          .json({ success: false, message: "OTP verification required" });
      }
      const resp = await directusClient.get("/users");
      const user_list = resp.data.data;
      const user_id = user_list.filter((entry)=> entry.email == user.email)[0].id
      res.json({ success: true, message: "Login successful", user_id : user_id });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

router.post("/verify-otp", async (req, res) => {
  console.log("Inside verify otp")
  const { email, otp, firstName, lastName, hashedPassword } = req.body; // Assume these are provided in the request
  try {
    // Perform the query using await
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const otp_int = parseInt(otp)
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = results[0];

    // Check password and OTP
    if (user.password === hashedPassword && user.otp === otp_int) {
      // Update the user authentication status
      await pool.query("UPDATE users SET is_authenticated = 1 WHERE email = ?", [email]);
      console.log("User authentication was successful");

      // Use the Directus client to create a new user in Directus
      const directusResponse = await directusClient.post("/users", {
        email: email,
        password: user.first_name + "123", // Example password concatenation
        first_name: user.first_name,
        last_name: user.last_name,
      });

      return res.json({
        success: true,
        message: "OTP verification successful, user added to Directus",
        data: directusResponse.data,
      });

    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials or OTP" });
    }
  } catch (error) {
    console.error("Error in user authentication process:", error);
    return res.status(500).json({ success: false, message: "Error processing request" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT first_name, last_name, email, role FROM users"
    );
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ success: false, message: "Error retrieving users" });
  }
});


router.post("/upload", upload.single("file"), async (req, res) => {
  try {
      const { folderId, title, description, tags, uploaded_by } = req.body;
      console.log("Folder ID:", folderId);
      console.log("Title:", title);
      console.log("Description:", description);
      console.log("Tags:", tags);
      console.log("Uploaded by:", uploaded_by);

      const file = req.file;
      if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
      }

      // Create the FormData object and append the file
      const formData = new FormData();
      formData.append("file", file.buffer, { filename: file.originalname, contentType: file.mimetype });

      // Upload the file to Directus using the pre-configured Axios client
      const uploadResponse = await directusClient.post("/files", formData, {
          headers: {
              ...formData.getHeaders(),
          }
      });

      if (uploadResponse.status !== 200) {
          throw new Error('Failed to upload file to Directus');
      }

      const fileId = uploadResponse.data.data.id;

      // Update the file's metadata
      const metadata = {
          folder: folderId,
          title: title,
          description: description,
          tags: tags,
          uploaded_by: uploaded_by
      };

      const updateResponse = await directusClient.patch(`/files/${fileId}`, metadata);

      if (updateResponse.status !== 200) {
          throw new Error('Failed to update metadata in Directus');
      }

      // Respond with success
      res.json({
          success: true,
          message: "File uploaded and metadata assigned successfully",
          data: updateResponse.data
      });
  } catch (error) {
      console.error("Error handling file upload to Directus:", error);
      res.status(500).json({
          message: "Failed to upload file to Directus and assign metadata",
          error: error.message
      });
  }
});



router.get("/folders", async (req, res) => {
  try {
    const response = await directusClient.get("/folders");
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch folders from Directus:", error);
    res.status(500).json({ message: "Failed to fetch folders from Directus" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    let {data} = await directusClient.get("/folders");
    if (!data) {
      return res.status(404).json({message: "No folders found"});
    }

    data = data.data;


    const courseMap = {};
    const rootCourses = [];


    data.forEach(course => {
      courseMap[course.id] = {...course, children: []};
    });


    router.get("/courses", async (req, res) => {
  try {
    let {data} = await directusClient.get("/folders");
    if (!data) {
      return res.status(404).json({message: "No folders found"});
    }

    data.forEach(course => {
      if (course.parent) {
        if (courseMap[course.parent]) {
          courseMap[course.parent].children.push(courseMap[course.id]);
        } else {

          console.warn("Orphaned course found, missing parent: ", course);
        }
      } else {

        rootCourses.push(courseMap[course.id]);
      }
    });

    res.json(rootCourses);
  } catch (error) {
    console.error("Failed to fetch folders from Directus:", error);
    res.status(500).json({message: "Failed to fetch folders from Directus"});
  }
});


    data.forEach(course => {
      if (course.parent) {
        if (courseMap[course.parent]) {
          courseMap[course.parent].children.push(courseMap[course.id]);
        } else {

          console.warn("Orphaned course found, missing parent: ", course);
        }
      } else {

        rootCourses.push(courseMap[course.id]);
      }
    });

    res.json(rootCourses);
  } catch (error) {
    console.error("Failed to fetch folders from Directus:", error);
    res.status(500).json({message: "Failed to fetch folders from Directus"});
  }
});

router.post("/updateRole", async (req, res) => {
  const { role, email } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE users SET role = ? WHERE email = ?",
      [role, email]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "User role updated successfully." });
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


router.get("/userRole/:email", async (req, res) => {
  const { email } = req.params; // Extract email from params using destructuring
  try {
    const [results] = await pool.query(
      "SELECT role FROM users WHERE email = ?",
      [email]
    );
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error retrieving user role:", error);
    res.status(500).json({ success: false, message: "Error retrieving user role" });
  }
});

router.get("/userFirstName/:email", async (req, res) => {
  const { email } = req.params; // Extract email from params using destructuring
  try {
    const [results] = await pool.query(
        "SELECT first_name, last_name FROM users WHERE email = ?",
        [email]
    );


    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error retrieving user FirstName:", error);
    res.status(500).json({ success: false, message: "Error retrieving user FirstName" });
  }
});

//record discussion
router.post('/discussions', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const query = 'INSERT INTO discussions (title, content) VALUES (?, ?)';
  try {
    const result = await pool.query(query, [title, content]);
    res.status(201).json({ message: 'Discussion created.', id: result.insertId });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error creating discussion.' });
  }
});

//record reply
router.post('/discussions/:id/replies', async (req, res) => {
  const { content } = req.body;
  const { id: discussionId } = req.params;
  const insertReplyQuery = 'INSERT INTO replies (discussion_id, content) VALUES (?, ?)';

  try {
    const [result] = await pool.execute(insertReplyQuery, [discussionId, content]);
    res.status(201).json({ message: 'Reply added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});
//get discussions
router.get('/discussions', async (req, res) => {
  const selectDiscussionsQuery = 'SELECT id, title FROM discussions';

  try {
    const [rows] = await pool.execute(selectDiscussionsQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching discussions' });
  }
});
//get discussion details
router.get('/discussions/:id', async (req, res) => {
  const { id } = req.params;
  const selectDiscussionQuery = 'SELECT * FROM discussions WHERE id = ?';
  const selectRepliesQuery = 'SELECT * FROM replies WHERE discussion_id = ?';

  try {
    const [discussion] = await pool.execute(selectDiscussionQuery, [id]);
    const [replies] = await pool.execute(selectRepliesQuery, [id]);

    if (discussion.length > 0) {
      res.status(200).json({ discussion: discussion[0], replies });
    } else {
      res.status(404).json({ message: 'Discussion not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching discussion details' });
  }
});
//likes
router.post('/discussions/:id/like', async (req, res) => {
  const { id } = req.params;
  const likeDiscussionQuery = 'UPDATE discussions SET likes = likes + 1 WHERE id = ?';

  try {
    const [result] = await pool.execute(likeDiscussionQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(200).json({ message: 'Discussion liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking discussion' });
  }
});

router.get("/files", async (req, res) => {
  try {
    const response = await directusClient.get('/files');
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching files from Directus:", error);
    res.status(500).json({
      message: "Failed to fetch files from Directus",
    });
  }
});

router.get('/searchFiles', async (req, res) => {
  try {
    // Check if there is a search term
    if (req.query.search) {
      const searchTerm = encodeURIComponent(req.query.search);
      // Construct the query only with the search term for title, description, and tags
      const query = `/files?search=${searchTerm}`;
      
      const response = await directusClient.get(`${query}`);
      console.log(response)
      res.json(response.data);
    } else {
      // If no search term is provided, respond with an error or empty array
      res.status(400).json({ message: 'No search term provided' });
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

router.get("/directusUsers", async (req, res) => {
  try {
    const response = await directusClient.get("/users");
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch users from Directus:", error);
    res.status(500).json({ message: "Failed to fetch users from Directus" });
  }
});


module.exports = router;


// Export the router
module.exports = router;
