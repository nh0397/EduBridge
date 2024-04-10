import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DiscussionDetail = () => {
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchDiscussionDetails = async () => {
      try {
        const response = await fetch(`/api/discussions/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDiscussion(data.discussion);
        setReplies(data.replies);
      } catch (error) {
        console.error('Error fetching discussion details:', error);
        setError('Failed to fetch discussion details.');
      }
    };

    fetchDiscussionDetails();
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/discussions/${id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you have an auth token, include it in the headers
          // 'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newReply })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setReplies([...replies, { content: newReply, id: data.id }]); // Add the new reply to the local state
      setNewReply(''); // Clear the input field
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