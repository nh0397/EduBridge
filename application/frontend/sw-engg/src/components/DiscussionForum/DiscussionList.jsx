import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService'; // Correct path to your apiService

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetchDiscussionsFromApi();
  }, []);

  const fetchDiscussionsFromApi = async () => {
    try {
      const data = await apiService.fetchDiscussions();
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };
  
  const deleteDiscussion = async (id) => {
    try {
      await apiService.deleteDiscussion(id);
      setDiscussions(discussions.filter((discussion) => discussion.id !== id));
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };
  

  const likeDiscussion = async (id) => { 
    try {
      await apiService.handleLike(id);
      // Optimistically update the UI
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === id) {
          return { ...discussion, likes: (discussion.likes || 0) + 1 };
        }
        return discussion;
      }));
    } catch (error) {
      console.error('Error liking discussion:', error);
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
            <button onClick={() => deleteDiscussion(discussion.id)}>Delete</button>
            <button onClick={() => likeDiscussion(discussion.id)}>Like</button>
            <span>Likes: {discussion.likes || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussionList;