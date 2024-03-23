import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './homepage.css'; // Make sure to create this CSS file and define your styles
import apiService from '../../services/apiService';

function Homepage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await apiService.fetchUsers();
        setUsers(usersData); // Set the users in state
      } catch (error) {
        console.error('Error fetching users:', error);
        // Optionally, handle the error in UI, like showing an error message
      }
    };

    getUsers();
  }, []);

  return (
    <div className="homepage-container">
      <input
        type="text"
        placeholder="Search by email..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            {/* Add other headers if needed */}
          </tr>
        </thead>
        <tbody>
          {users.filter(user => 
            user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.user_email}</td>
              {/* Add other data cells if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Homepage;
