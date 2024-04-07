import React from 'react';
import Post from './Post'; 

// Mock Converstaions
// Fetch the list of posts from backend and manage it with React's useState and useEffect hooks.
const conversationsData = [
  {
    id: 1,
    content: 'What are your thoughts on the latest React update?',
    likes: 12,
    dislikes: 2,
    replies: [
      { id: 1, content: 'I love the new features!', likes: 2, dislikes: 0 },
      { id: 2, content: 'Still getting used to the changes.', likes: 1, dislikes: 1 },
    ],
  },
  // Add more posts as needed
];

const Conversations = () => {
  return (
    <div>
      <h3>Conversations</h3>
      {conversationsData.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Conversations;
