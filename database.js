const mysql = require('mysql');
require('dotenv').config(); 

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '', 
    database: process.env.DATABASE_NAME || 'student_stack', 
});
database.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = database;

