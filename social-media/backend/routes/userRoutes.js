import express from 'express';
import {
  getUser,
  updateUser,
  uploadProfilePic,
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
import upload from '../middleware/upload.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes

// Relationship routes (must be before /:userId)
router.get('/relationships/count/:userId', getRelationshipCounts);
router.get('/relationships/check', checkFollowing);

// Suggestions route (must be before /:userId)
router.get('/suggestions/:userId', getSuggestions);

// Friends route (must be before /:userId)
router.get('/friends/:userId', getFriends);

// Followers/Following routes (must be before /:userId)
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

// Single user by ID (must be LAST for GET requests)
router.get('/:userId', getUser);

// Upload profile picture (must be before generic PUT :userId)
router.put('/:userId/avatar', authenticateToken, upload.single('photo'), uploadProfilePic);

// Update user
router.put('/:userId', updateUser);

export default router;
