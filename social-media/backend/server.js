import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import highlightRoutes from './routes/highlightRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import hashtagRoutes from './routes/hashtagRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}!`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
