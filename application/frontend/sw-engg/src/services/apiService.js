import axios from "axios";
import config from "../config";


const signup = (firstName, lastName, email, password) => {
  console.log("inside apiservice");
  // Hash the password client-side (understanding the security implications)
  return axios.post(`${config.BASE_URL}/signup`, {
    firstName,
    lastName,
    email,
    password: password,
  });
};

const login = (email, password) => {
  return axios.post(`${config.BASE_URL}/login`, { email, password });
};

const loginWithOtp = (email, hashedPassword, otp) => {
  return axios.post(`${config.BASE_URL}/verify-otp`, { email, hashedPassword, otp });
}

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/users`);
    return response.data.data; // Assuming the response structure includes data within data
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow the error so the calling function can handle it
  }
};

// Inside your apiService.js or a similar service file in your React app

const uploadFile = (file, folderId) => {
  const formData = new FormData();
  formData.append("file", file);

  // Construct the URL to include the folderId as a query parameter
  const url = folderId ? `${config.BASE_URL}/upload?folderId=${folderId}` : `${config.BASE_URL}/upload`;

  return axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const fetchFolders = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/folders`);
    return response.data.data; // Assuming Directus standard response structure
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

// Export the service functions
export default {
  signup,
  login,
  loginWithOtp,
  fetchUsers,
  uploadFile,
  fetchFolders
};
