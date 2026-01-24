import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Legacy routes for backward compatibility
// These redirect to the new route structure
app.get('/api/likes', async (req, res) => {
  // Forward to post routes
  const postRoutes = await import('./routes/postRoutes.js');
  req.url = '/likes';
  postRoutes.default(req, res);
});

app.post('/api/likes', async (req, res, next) => {
  req.url = '/likes';
  const { toggleLike } = await import('./controllers/postController.js');
  toggleLike(req, res);
});

app.post('/api/bookmarks', async (req, res) => {
  const { toggleBookmark } = await import('./controllers/postController.js');
  toggleBookmark(req, res);
});

app.get('/api/bookmarks/check', async (req, res) => {
  const { checkBookmark } = await import('./controllers/postController.js');
  checkBookmark(req, res);
});

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
