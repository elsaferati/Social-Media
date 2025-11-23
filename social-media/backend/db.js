const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default MySQL user
  password: 'your_password', // CHANGE THIS TO YOUR MYSQL PASSWORD
  database: 'social_app_db',
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL Database');
    connection.release();
  }
});

module.exports = db.promise();