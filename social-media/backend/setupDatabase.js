import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  let connection;
  
  try {
    // Connect without database first to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL server');

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'social_app_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);
    console.log(`Using database: ${dbName}`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profilePic VARCHAR(255) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table ready');

    // Add columns if they don't exist (for existing databases)
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'`);
      console.log('  Added role column');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }

    try {
      await connection.query(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL`);
      console.log('  Added bio column');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }

    // Create posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        img VARCHAR(255) DEFAULT NULL,
        userId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Posts table ready');

    // Create comments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        userId INT NOT NULL,
        postId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Comments table ready');

    // Create likes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        postId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (userId, postId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Likes table ready');

    // Create relationships (follows) table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS relationships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        followerUserId INT NOT NULL,
        followedUserId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_follow (followerUserId, followedUserId),
        FOREIGN KEY (followerUserId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (followedUserId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Relationships table ready');

    // Create bookmarks table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        postId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_bookmark (userId, postId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Bookmarks table ready');

    // Create notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        receiverUserId INT NOT NULL,
        senderUserId INT NOT NULL,
        type ENUM('like', 'follow', 'comment') NOT NULL,
        postId INT DEFAULT NULL,
        isRead TINYINT(1) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (receiverUserId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (senderUserId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Notifications table ready');

    // Create messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Messages table ready');

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_posts_userId ON posts(userId)',
      'CREATE INDEX IF NOT EXISTS idx_comments_postId ON comments(postId)',
      'CREATE INDEX IF NOT EXISTS idx_likes_postId ON likes(postId)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_receiver ON notifications(receiverUserId)',
      'CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId)',
      'CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiverId)',
    ];

    for (const idx of indexes) {
      try {
        await connection.query(idx);
      } catch (e) {
        // Index might already exist, that's fine
      }
    }
    console.log('✓ Indexes created');

    console.log('\n========================================');
    console.log('Database setup completed successfully!');
    console.log('========================================\n');

    // Show table counts
    const tables = ['users', 'posts', 'comments', 'likes', 'relationships', 'bookmarks', 'notifications', 'messages'];
    console.log('Current table counts:');
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${rows[0].count} rows`);
    }

  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

setupDatabase();
