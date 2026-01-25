import express from 'express';
import {
  getStories,
  getStory,
  getUserStories,
  createStory,
  updateStory,
  deleteStory,
  viewStory,
  getStoryViewers,
  getAllStories,
  deleteExpiredStories
} from '../controllers/storyController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public/User routes
router.get('/feed/:userId', getStories);
router.get('/user/:userId', getUserStories);
router.get('/:id', getStory);
router.get('/:id/viewers', getStoryViewers);

// Protected routes
router.post('/', upload.single('image'), createStory);
router.put('/:id', optionalAuth, upload.single('image'), updateStory);
router.delete('/:id', optionalAuth, deleteStory);
router.post('/:id/view', viewStory);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllStories);
router.delete('/cleanup/expired', authenticateToken, isAdmin, deleteExpiredStories);

export default router;
