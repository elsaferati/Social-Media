import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const resetPassword = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'social_app_db'
    });

    // Get email and new password from command line arguments
    const email = process.argv[2];
    const newPassword = process.argv[3] || 'password123';
    
    if (!email) {
      console.log('Usage: node resetPassword.js <email> [newPassword]');
      console.log('Example: node resetPassword.js elsa@gmail.com myNewPassword');
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    const [result] = await connection.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows > 0) {
      console.log(`\n✓ Password reset successfully for ${email}`);
      console.log(`New password: ${newPassword}`);
    } else {
      console.log(`\n✗ User not found with email: ${email}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

resetPassword();
