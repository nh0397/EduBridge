const express = require('express');
const userRoutes = require('./routes/routes'); // Import the user routes
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// Use userRoutes for any request that comes to '/api/users'
app.use('/', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});