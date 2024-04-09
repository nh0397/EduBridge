const mysql = require('mysql2/promise');

// Create a MySQL pool with `mysql2` promise support
const pool = mysql.createPool({
    connectionLimit : 1000,
    host     : '54.91.50.46',    
    user     : 'root',
    password : 'csc848',
    database : 'csc848',
    port     : 3306
});

module.exports = pool;
