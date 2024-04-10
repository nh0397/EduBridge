import axios from "axios";
import config from "../config";

const signup = (firstName, lastName, email, password) => {
  return axios.post(`${config.BASE_URL}/signup`, {
    firstName,
    lastName,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios.post(`${config.BASE_URL}/login`, { email, password });
};

const loginWithOtp = (email, hashedPassword, otp) => {
  return axios.post(`${config.BASE_URL}/verify-otp`, { email, hashedPassword, otp });
};

const fetchUsers = async () => {
  const response = await axios.get(`${config.BASE_URL}/users`);
  return response.data.data;
};

const updateUserRole = async (email, newRole) => {
  const response = await axios.post(`${config.BASE_URL}/updateRole`, {
    role: newRole,
    email: email
  });
  return response.data;
};

const uploadFile = (formData) => {
  return axios.post(`${config.BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const fetchFolders = async () => {
  const response = await axios.get(`${config.BASE_URL}/folders`);
  return response.data.data;
};

const fetchUserRole = async (email) => {
  const response = await axios.get(`${config.BASE_URL}/userRole/${email}`);
  return response.data.data;
};

const createDiscussion = async (title, content) => {
  const response = await axios.post(`${config.BASE_URL}/discussions`, { title, content });
  return response.data;
};

const fetchFiles = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/files`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Export the service functions
export default {
  signup,
  login,
  loginWithOtp,
  fetchUsers,
  uploadFile,
  fetchFolders,
  updateUserRole,
  fetchUserRole,
  createDiscussion,
  fetchFiles,
};
