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
  deleteMessage
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

export default router;
