import express from 'express';
import {
  getStats,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
  getAllMessages,
  deleteMessage,
  // Stories
  getAdminStories,
  getAdminStory,
  updateAdminStory,
  deleteAdminStory,
  // Reports
  getAdminReports,
  getAdminReport,
  updateAdminReport,
  deleteAdminReport,
  // Hashtags
  getAdminHashtags,
  getAdminHashtag,
  createAdminHashtag,
  updateAdminHashtag,
  deleteAdminHashtag,
  // Activity Logs
  getAdminActivityLogs,
  getAdminActivityLog,
  updateAdminActivityLog,
  deleteAdminActivityLog,
  // Likes
  getAdminLikes,
  deleteAdminLike,
  // Highlights
  getAdminHighlights,
  getAdminHighlight,
  deleteAdminHighlight
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getStats);

// Users management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Posts management
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);

// Comments management
router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteComment);

// Messages management
router.get('/messages', getAllMessages);
router.delete('/messages/:id', deleteMessage);

// Stories management
router.get('/stories', getAdminStories);
router.get('/stories/:id', getAdminStory);
router.put('/stories/:id', updateAdminStory);
router.delete('/stories/:id', deleteAdminStory);

// Reports management
router.get('/reports', getAdminReports);
router.get('/reports/:id', getAdminReport);
router.put('/reports/:id', updateAdminReport);
router.delete('/reports/:id', deleteAdminReport);

// Hashtags management
router.get('/hashtags', getAdminHashtags);
router.get('/hashtags/:id', getAdminHashtag);
router.post('/hashtags', createAdminHashtag);
router.put('/hashtags/:id', updateAdminHashtag);
router.delete('/hashtags/:id', deleteAdminHashtag);

// Activity Logs management
router.get('/activity-logs', getAdminActivityLogs);
router.get('/activity-logs/:id', getAdminActivityLog);
router.put('/activity-logs/:id', updateAdminActivityLog);
router.delete('/activity-logs/:id', deleteAdminActivityLog);

// Likes management
router.get('/likes', getAdminLikes);
router.delete('/likes/:id', deleteAdminLike);

// Highlights management (profile story highlights)
router.get('/highlights', getAdminHighlights);
router.get('/highlights/:id', getAdminHighlight);
router.delete('/highlights/:id', deleteAdminHighlight);

export default router;
