import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/apiService'; // Import your apiService

const DiscussionDetail = () => {
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    fetchDiscussionDetails();
  }, [id]); // Add fetchDiscussionDetails to the dependency array

  const fetchDiscussionDetails = async () => {
    try {
      const data = await apiService.fetchDiscussionDetail(id); // Update this to the correct function name if needed

      console.log(data.data);
      setDiscussion(data.data.discussion);
      setReplies(data.data.replies);
    } catch (error) {
      console.error('Error fetching discussion details:', error);
      setError('Failed to fetch discussion details.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) {
      setError('Reply cannot be empty.');
      return;
    }
    try {
      const data = await apiService.postReply(id, newReply); // Update this to the correct function name if needed
      setReplies([...replies, { content: newReply, id: data.data.id }]);
      setNewReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply.');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {discussion && (
        <>
          <h2>{discussion.title}</h2>
          <p>{discussion.content}</p>
          <h3>Replies</h3>
          {replies.length > 0 ? (
            <ul>
              {replies.map((reply) => (
                <li key={reply.id}>{reply.content}</li>
              ))}
            </ul>
          ) : (
            <p>No replies yet. Be the first to reply!</p>
          )}
          <form onSubmit={handleReplySubmit}>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write your reply here..."
              required
            />
            <button type="submit">Submit Reply</button>
          </form>
        </>
      )}
    </div>
  );
};

export default DiscussionDetail;