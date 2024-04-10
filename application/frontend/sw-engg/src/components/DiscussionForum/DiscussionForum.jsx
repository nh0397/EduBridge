import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './DiscussionForum.css';

const DiscussionForum = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(''); // State to hold confirmation message
  const navigate = useNavigate(); // Hook for redirecting

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError(''); // Reset error when user starts typing again
    setConfirmation(''); // Reset confirmation message as well
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state on each submission attempt
    if (title.length > 150) {
      setError('Title must be less than 150 characters.');
      return;
    }
    if (!title.trim() || !text.trim()) {
      setError('Please enter a title and text for the discussion.');
      return;
    }

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization headers if needed
          // 'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, content: text })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to create discussion.');
        return;
      }

      // Confirmation message
      setConfirmation('Discussion created successfully!');

      // Navigate to the Discussion Detail page for the newly created discussion
      navigate(`/discussion/${data.id}`);
    } catch (error) {
      console.error('Error creating discussion:', error);
      setError('Failed to create discussion.');
    }
  };

  return (
    <div className="discussion-form-container">
      <h2 className="discussion-form-header">Create a Discussion</h2>
      {error && <p className="error">{error}</p>}
      {confirmation && <p className="confirmation">{confirmation}</p>}
      <form onSubmit={handleSubmit}>
        <label className="discussion-form-header" htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          className="discussion-title-input"
          value={title}
          onChange={handleTitleChange}
          maxLength="150"
          required
        />

        <label className="discussion-form-header" htmlFor="text">Text Content:</label>
        <textarea
          id="text"
          className="discussion-textarea"
          value={text}
          onChange={handleTextChange}
          required
        />

        <button type="submit" className="discussion-submit-btn">Create Discussion</button>
        <Link to="/discussions" className="view-discussions-btn">View All Discussions</Link>
      </form>
    </div>
  );
};

export default DiscussionForum;
