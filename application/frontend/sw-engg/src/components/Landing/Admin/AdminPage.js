import React, { useState, useEffect } from 'react';
import './AdminPage.css';

// Mock data
const initialUsers = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', role: 'student' },
  { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', role: 'instructor' },
  // ...other users
];

const AdminPage = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    // Fetch users from the backend and set them in state
    // setUsers(fetchedUsers);
  }, []);

  const handleRoleChange = (userId, newRole) => {
    // Update the role in the backend, then update state locally
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);

    // TODO: Make an API call to update the user role in the backend
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
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
