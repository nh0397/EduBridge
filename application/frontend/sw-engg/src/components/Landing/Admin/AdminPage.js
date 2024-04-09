import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import apiService from '../../../services/apiService'
// Mock data
const initialUsers = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', role: 'student' },
  { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', role: 'instructor' },
  // ...other users
];

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    console.log("load users called");
    try {
      const fetchedUsers = await apiService.fetchUsers();
      console.log('fe',fetchedUsers)
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  const handleRoleChange = async (email, newRole) => {
    try {
      const response = await apiService.updateUserRole(email, newRole);
      // Assuming response indicates success, then update local state
      if (response.success) {
        const updatedUsers = users.map(user =>
          user.email === email ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
      } else {
        console.error('Failed to update user role in the database.');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
    loadUsers()
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Admin Page</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user.email, e.target.value)}>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
