const express = require("express");
const pool = require("../Services/database"); // Make sure this path is correct

const router = express.Router();

// Record discussion
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
  
    const query = 'INSERT INTO discussions (title, content) VALUES (?, ?)';
    try {
      const result = await pool.query(query, [title, content]);
      res.status(201).json({ message: 'Discussion created.', id: result[0].insertId });
      console.log(result);
      console.log(result[0].insertId);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error creating discussion.' });
    }
});

// Record reply
router.post('/:id/replies', async (req, res) => {
    const { content } = req.body;
    const { id: discussionId } = req.params;
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const insertReplyQuery = 'INSERT INTO replies (discussion_id, content) VALUES (?, ?)';
    try {
      const [result] = await pool.execute(insertReplyQuery, [discussionId, content]);
      console.log(result);
      res.status(201).json({ message: 'Reply added successfully', id: result.insertId });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error adding reply' });
    }
});



// Get discussions
router.get('/', async (req, res) => {
    const selectDiscussionsQuery = 'SELECT id, title FROM discussions';
    try {
      const [rows] = await pool.execute(selectDiscussionsQuery);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error fetching discussions' });
    }
});

// Get discussion details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const selectDiscussionQuery = 'SELECT * FROM discussions WHERE id = ?';
    const selectRepliesQuery = 'SELECT * FROM replies WHERE discussion_id = ?';
  
    try {
      const [discussion] = await pool.execute(selectDiscussionQuery, [id]);
      const [replies] = await pool.execute(selectRepliesQuery, [id]);
  
      if (discussion.length === 0) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
      res.status(200).json({ discussion: discussion[0], replies });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error fetching discussion details' });
    }
});

// Likes
router.post('/:id/like', async (req, res) => {
    const { id } = req.params;
    const likeDiscussionQuery = 'UPDATE discussions SET likes = likes + 1 WHERE id = ?';
  
    try {
      const [result] = await pool.execute(likeDiscussionQuery, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
      res.status(200).json({ message: 'Discussion liked successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error liking discussion' });
    }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteDiscussionQuery = 'DELETE FROM discussions WHERE id = ?';
  try {
    const [result] = await pool.execute(deleteDiscussionQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Discussion not found or you do not have permission to delete this discussion' });
    }
    res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error deleting discussion' });
  }
});

module.exports = router;