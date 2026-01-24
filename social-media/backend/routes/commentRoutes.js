import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} from '../controllers/commentController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:postId', getComments);
router.get('/count/:postId', getCommentCount);

// Protected routes
router.post('/', createComment);
router.put('/:id', optionalAuth, updateComment);
router.delete('/:id', optionalAuth, deleteComment);

export default router;
