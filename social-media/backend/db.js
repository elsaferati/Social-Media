import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || 'social_app_db',
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL Database');
    connection.release();
  }
});

export default db.promise();