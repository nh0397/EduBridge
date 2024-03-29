const mysql = require('mysql');

// Create a MySQL pool
const pool = mysql.createPool({
    connectionLimit : 10, // the number of connections node.js will hold open to our database
    host     : 'localhost', // Your RDS instance endpoint    
    user     : 'root', // Your RDS instance username
    password : 'csc848', // Your RDS instance password
    database : 'csc848', // Your database name
    port     : 3306 // Your RDS instance port
});

// Export the pool
module.exports = pool;
