const mysql = require('mysql2/promise');

// Create a MySQL pool with `mysql2` promise support
const pool = mysql.createPool({
    connectionLimit : 5000,
    host     : '127.0.0.1', // Use this if MySQL is in a Docker container
    user     : 'root',
    password : 'example_root_password',
    database : 'csc848',
    port     : 3306
});


module.exports = pool;
