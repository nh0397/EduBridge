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
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp, firstName, lastName, hashedPassword } = req.body; // Assume these are provided in the request

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error("Error fetching user:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching user" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const user = results[0];

      // Assuming you're comparing the hashed password stored in your database
      if (user.password === hashedPassword && user.otp === otp) {
        try {
          pool.query(
            "Update users set is_authenticated = 1 WHERE email = ?",
            [email],
            async (error, results) => {
              if (error) {
                console.error("Error authenticating user", error);
                return res
                  .status(500)
                  .json({
                    success: false,
                    message: "Error authenticating user",
                  });
              } else {
                console.log("User authentication was successful");
              }
            }
          );
          // Use the Directus client to create a new user in Directus
          const directusResponse = await directusClient.post("/users", {
            email: email,
            password: user.first_name + "123", // Send the plain password for Directus to hash
            first_name: user.first_name,
            last_name: user.last_name,
          });

          // Optionally, update anything else in your database post-creation in Directus

          return res.json({
            success: true,
            message: "OTP verification successful, user added to Directus",
            data: directusResponse.data,
          });
        } catch (directusError) {
          console.error("Error adding user to Directus:", directusError);
          return res
            .status(500)
            .json({
              success: false,
              message: "Failed to add user to Directus",
            });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials or OTP" });
      }
    }
  );
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
    const { folderId, title, description, tags } = req.body; // Extract data from the FormData object
    console.log("Folder ID:", folderId); // Print folder ID
    console.log("Title:", title); // Print title
    console.log("Description:", description); // Print description
    console.log("Tags:", tags); // Print tags

    const file = req.file; // The uploaded file
    console.log("file", file);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the file to Directus
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    const uploadResponse = await directusClient.post("/files", formData, {
      headers: formData.getHeaders(),
    });

    const fileId = uploadResponse.data.data.id; // Assuming Directus response structure

    // Update the file's metadata to assign it to the folder and add additional details
    const metadata = {
      folder: folderId,
      title: title,
      description: description,
      tags: tags,
      // Add more metadata fields as needed
    };

    await directusClient.patch(`/files/${fileId}`, metadata);

    // Respond with success
    res.json({
      success: true,
      message: "File uploaded and metadata assigned successfully",
    });
  } catch (error) {
    console.error("Error handling file upload to Directus:", error);
    res.status(500).json({
      message: "Failed to upload file to Directus and assign metadata",
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

// Export the router
module.exports = router;
