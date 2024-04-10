
const express = require("express");
const CryptoJS = require("crypto-js");
const multer = require("multer"); // Using multer for file uploads
const FormData = require("form-data");

const router = express.Router();
const pool = require("../Services/database");

//record discussion
router.post('/discussions', async (req, res) => {
    console.log('Request received to /discussions');
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