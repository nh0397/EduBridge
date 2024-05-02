const express = require("express");
const pool = require("../Services/database"); // Make sure this path is correct

const router = express.Router();

//Record Discussion
router.post('/', async (req, res) => {
  const { title, content, userEmail } = req.body;

  if (!title || !content || !userEmail) {
    return res.status(400).json({ message: 'Title, content, and userEmail are required.' });
  }

  const query = 'INSERT INTO discussions (title, content, user_id) VALUES (?, ?, ?)';
  try {
    const result = await pool.query(query, [title, content, userEmail]);
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
  const selectDiscussionsQuery = 'select d.id, d.title, d.content, u.first_name, u.last_name, d.likes, d.dislikes, d.created_at from  discussions d inner join users u  on d.user_id = u.email order by d.created_at desc;';
  const selectRepliesQuery = 'SELECT * FROM replies';
  try {
    const [discussions] = await pool.execute(selectDiscussionsQuery);
    const [replies] = await pool.execute(selectRepliesQuery);
    res.status(200).json({ discussion: discussions, replies });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching discussions' });
  }
});


// Get discussion details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const selectDiscussionQuery = 'SELECT id, title, content, likes, dislikes FROM discussions WHERE id = ?';
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

// Record Likes
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

// Record Dislikes
router.post('/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const dislikeDiscussionQuery = 'UPDATE discussions SET dislikes = dislikes + 1 WHERE id = ?';

  try {
    const [result] = await pool.execute(dislikeDiscussionQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.status(200).json({ message: 'Discussion disliked successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error disliking discussion' });
  }
});

//Delete Discussion
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

// Update Discussion
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const updateDiscussionQuery = 'UPDATE discussions SET title = ?, content = ? WHERE id = ? AND user_id = ?'; // Add user_id condition
  const userEmail = req.body.userEmail; // Assuming you're sending the userEmail from the frontend

  try {
    const [result] = await pool.execute(updateDiscussionQuery, [title, content, id, userEmail]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Discussion not found or you do not have permission to edit this discussion' });
    }
    res.status(200).json({ message: 'Discussion updated successfully', discussion: { id, title, content } });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error updating discussion' });
  }
});

//Get a specific user's discussions
router.get('/my/:userEmail', async (req, res) => {
  const { userEmail } = req.params;


  const selectDiscussionsQuery = 'SELECT id, title, content, likes, dislikes FROM discussions WHERE user_id = ?';
  const selectRepliesQuery = 'SELECT * FROM replies';
  try {

    const [discussions] = await pool.execute(selectDiscussionsQuery, [userEmail]);
    const [replies] = await pool.execute(selectRepliesQuery);
    res.status(200).json({ discussion: discussions, replies });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching my discussions' });
  }
});

module.exports = router;