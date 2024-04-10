import React, { useState } from 'react';

const Post = ({ content, likes, dislikes, replies }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="post">
      <p>{content}</p>
      <div>
        <button onClick={() => setShowReplies(!showReplies)}>Replies</button>
        <span>👍 {likes}</span>
        <span>👎 {dislikes}</span>
      </div>
      {showReplies && (
        <div className="replies">
          {replies.map((reply) => (
            <div key={reply.id} className="reply">
              <p>{reply.content}</p>
              <span>👍 {reply.likes}</span>
              <span>👎 {reply.dislikes}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
