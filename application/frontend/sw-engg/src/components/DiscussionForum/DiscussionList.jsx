import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch('/api/discussions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/discussions/${id}/like`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Could not like the discussion');
      }
      // Optimistically update the UI
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === id) {
          return { ...discussion, likes: (discussion.likes || 0) + 1 };
        }
        return discussion;
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Discussions</h2>
      <ul>
        {discussions.map((discussion) => (
          <li key={discussion.id}>
            <Link to={`/discussion/${discussion.id}`}>{discussion.title}</Link>
            {' '}
            <button onClick={() => handleLike(discussion.id)}>Like</button>
            <span>Likes: {discussion.likes || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussionList;