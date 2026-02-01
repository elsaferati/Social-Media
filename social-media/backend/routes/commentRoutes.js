import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount,
  likeComment
} from '../controllers/commentController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get comments (optional auth for like state)
router.get('/:postId', optionalAuth, getComments);
router.get('/count/:postId', getCommentCount);

// Protected routes
router.post('/', authenticateToken, createComment);
router.put('/:id', optionalAuth, updateComment);
router.delete('/:id', optionalAuth, deleteComment);
router.post('/:id/like', authenticateToken, likeComment);

export default router;
