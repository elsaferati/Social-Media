import express from 'express';
import {
  getUser,
  updateUser,
  getSuggestions,
  getFriends,
  followUser,
  unfollowUser,
  getRelationshipCounts,
  checkFollowing,
  getFollowers,
  getFollowing
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/suggestions/:userId', getSuggestions);
router.get('/friends/:userId', getFriends);
router.get('/:userId', getUser);

// Relationship routes
router.get('/relationships/count/:userId', getRelationshipCounts);
router.get('/relationships/check', checkFollowing);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

// Protected routes
router.put('/:userId', updateUser);

export default router;
