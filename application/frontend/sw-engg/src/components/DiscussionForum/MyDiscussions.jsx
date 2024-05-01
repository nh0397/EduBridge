import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const MyDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [discussionToEdit, setDiscussionToEdit] = useState(null);

  useEffect(() => {
    fetchMyDiscussionsFromApi();
  }, []);

  const fetchMyDiscussionsFromApi = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const data = await apiService.fetchMyDiscussions(userEmail);
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching my discussions:', error);
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

  const handleDislike = async (discussionId) => {
    try {
      await apiService.dislikeDiscussion(discussionId);
      // Update the discussions state with the new dislike count
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === discussionId) {
          return { ...discussion, dislikes: discussion.dislikes + 1 };
        }
        return discussion;
      });
      setDiscussions(updatedDiscussions);
    } catch (error) {
      console.error('Error disliking discussion:', error);
    }
  };

  const handleEditClick = (discussion) => {
    setIsEditing(true);
    setEditedTitle(discussion.title);
    setEditedText(discussion.text);
    setDiscussionToEdit(discussion);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedText('');
    setDiscussionToEdit(null);
  };

  const handleSaveEdit = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const updatedDiscussion = await apiService.updateDiscussion(discussionToEdit.id, editedTitle, editedText, userEmail);
      const updatedDiscussions = discussions.map((discussion) =>
        discussion.id === updatedDiscussion.id ? updatedDiscussion : discussion
      );
      setDiscussions(updatedDiscussions);
      setIsEditing(false);
      setEditedTitle('');
      setEditedText('');
      setDiscussionToEdit(null);
    } catch (error) {
      console.error('Error updating discussion:', error);
    }
  };

  return (
    <div className="my-discussions">
      <h2>My Discussions</h2>
      {discussions.length === 0 ? (
        <p>You haven't created any discussions yet.</p>
      ) : (
        <ul>
          {discussions.map((discussion) => (
            <li key={discussion.id}>
              {isEditing && discussionToEdit.id === discussion.id ? (
                <div>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <Link to={`/discussion/${discussion.id}`}>{discussion.title}</Link>
                  <p>{discussion.text}</p>
                  <p>Likes: {discussion.likes || 0} | Dislikes: {discussion.dislikes || 0}</p>
                  <button onClick={() => likeDiscussion(discussion.id)}>Like</button>
                  <button onClick={() => handleDislike(discussion.id)}>Dislike</button>
                  <button onClick={() => deleteDiscussion(discussion.id)}>Delete</button>
                  <button onClick={() => handleEditClick(discussion)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDiscussions;