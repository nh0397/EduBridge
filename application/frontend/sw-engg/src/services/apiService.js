import axios from "axios";
import config from "../config";


const signup = (email, password) => {
  console.log("inside apiservice");
  // Hash the password client-side (understanding the security implications)
  return axios.post(`${config.BASE_URL}/signup`, {
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

// Export the service functions
export default {
  signup,
  login,
  loginWithOtp,
  fetchUsers
};
