const axios = require('axios');

// Configuration for Directus API
const DIRECTUS_API_URL = 'http://127.0.0.1:8055'; // Your Directus instance URL
const DIRECTUS_API_TOKEN = '836f8SW1VqRDIkFt368WsTHQPkm0t0qv'; // Static token for API access

// Create an Axios instance for Directus
const directusClient = axios.create({
  baseURL: DIRECTUS_API_URL,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`
  }
});

// Function to test connection to Directus (similar to the ping example)
async function pingDirectus() {
  try {
    const response = await directusClient.get('/server/ping');
    console.log('Directus is up and running:', response.data);
    return true; // Directus is reachable
  } catch (error) {
    console.error('Error pinging Directus:', error);
    return false; // Directus is not reachable
  }
}

// Export the Directus client and any utility functions
module.exports = { directusClient, pingDirectus };
