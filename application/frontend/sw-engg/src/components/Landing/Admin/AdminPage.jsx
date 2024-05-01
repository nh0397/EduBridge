import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import theme from '../../../theme';
import apiService from "../../../services/apiService";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await apiService.fetchUsers();

      const usersWithDefaultRole = fetchedUsers.map(user => ({
        ...user,
        role: user.role || 'Student' // Set default to 'Student' if not specified
      }));
      setUsers(usersWithDefaultRole);

      setUsers(fetchedUsers);

    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleRoleChange = async (email, newRole) => {

    // Prevent changing the role of admins
    if (users.find(user => user.email === email && user.role === 'admin')) {

    const user = users.find(user => user.email === email);



      setFeedback({ open: true, message: 'Admin role cannot be changed.', severity: 'error' });
      return;
    }

    try {
      const response = await apiService.updateUserRole(email, newRole);
      if (response.success) {
        const updatedUsers = users.map(user =>
            user.email === email ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        setFeedback({ open: true, message: 'Role updated successfully.', severity: 'success' });
      } else {
        console.error('Failed to update user role in the database.');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  const filteredUsers = searchQuery ? users.filter(user =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : users;

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(3),
            height: 'auto',
            backgroundColor: theme.palette.background.default,
          }}
      >
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 800, margin: theme.spacing(2), padding: theme.spacing(3) }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: theme.spacing(2) }}>
            Admin Page
          </Typography>
          <TextField
              fullWidth
              variant="outlined"
              label="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: theme.spacing(2) }}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                          'Admin' // Display text only for admins
                      ) : (

                          <Select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.email, e.target.value)}
                              fullWidth
                          >
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Instructor">Instructor</MenuItem>
                          </Select>
                      )}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Snackbar open={feedback.open} autoHideDuration={6000} onClose={handleCloseFeedback}>
          <Alert onClose={handleCloseFeedback} severity={feedback.severity} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default AdminPage;
