import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService'; // Import your apiService
import './DiscussionForum.css';

const DiscussionForum = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError('');
    setConfirmation('');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (title.length > 150) {
      setError('Title must be less than 150 characters.');
      return;
    }
    if (!title.trim() || !text.trim()) {
      setError('Please enter a title and text for the discussion.');
      return;
    }

    try {
      const data = await apiService.createDiscussion(title, text); // Use the apiService here
      setConfirmation('Discussion created successfully!');
      navigate(`/discussion/${data.id}`);
    } catch (error) {
      setError('Failed to create discussion.');
      console.error('Error creating discussion:', error);
    }
  };

  return (
    <div className="discussion-form-container">
      <h2 className="discussion-form-header">Create a Discussion</h2>
      {error && <p className="error">{error}</p>}
      {confirmation && <p className="confirmation">{confirmation}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="discussion-form-header">Title:</label>
        <input
          type="text"
          id="title"
          className="discussion-title-input"
          value={title}
          onChange={handleTitleChange}
          maxLength="150"
          required
        />
        <label htmlFor="text" className="discussion-form-header">Text Content:</label>
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
