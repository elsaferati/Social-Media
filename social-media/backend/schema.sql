-- Social Media App Database Schema
-- Run this SQL to set up or update your database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS social_app_db;
USE social_app_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profilePic VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add role column if it doesn't exist (for existing databases)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL;

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  userId INT NOT NULL,
  postId INT NOT NULL,
  parentCommentId INT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parentCommentId) REFERENCES comments(id) ON DELETE CASCADE
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  commentId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_comment_like (userId, commentId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (commentId) REFERENCES comments(id) ON DELETE CASCADE
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (userId, postId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- Relationships (follows) table
CREATE TABLE IF NOT EXISTS relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  followerUserId INT NOT NULL,
  followedUserId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (followerUserId, followedUserId),
  FOREIGN KEY (followerUserId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followedUserId) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bookmark (userId, postId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- Notifications table
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
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senderId INT NOT NULL,
  receiverId INT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_userId ON posts(userId);
CREATE INDEX IF NOT EXISTS idx_comments_postId ON comments(postId);
CREATE INDEX IF NOT EXISTS idx_comments_parentCommentId ON comments(parentCommentId);
CREATE INDEX IF NOT EXISTS idx_comment_likes_commentId ON comment_likes(commentId);
CREATE INDEX IF NOT EXISTS idx_likes_postId ON likes(postId);
CREATE INDEX IF NOT EXISTS idx_notifications_receiver ON notifications(receiverUserId);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiverId);

-- Insert a default admin user (password: admin123)
-- INSERT INTO users (username, email, password, role) 
-- VALUES ('admin', 'admin@example.com', '$2a$10$YOUR_HASHED_PASSWORD', 'admin');
