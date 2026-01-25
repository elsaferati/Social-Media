import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'social_app_db'
    });

    // Get the user ID from command line argument or default to 1
    const userId = process.argv[2] || 1;
    
    // Update user to admin
    const [result] = await connection.query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', userId]
    );

    if (result.affectedRows > 0) {
      // Get the updated user
      const [users] = await connection.query(
        'SELECT id, username, email, role FROM users WHERE id = ?',
        [userId]
      );
      console.log('\n✓ User updated to admin successfully!');
      console.log('User details:', users[0]);
    } else {
      console.log('\n✗ User not found with ID:', userId);
    }

    // List all users
    console.log('\nAll users:');
    const [allUsers] = await connection.query(
      'SELECT id, username, email, role FROM users'
    );
    console.table(allUsers);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

makeAdmin();
