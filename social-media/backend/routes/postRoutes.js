import express from 'express';
import {
  getAllPosts,
  getFeedPosts,
  getPost,
  getUserPosts,
  getExplorePosts,
  getBookmarkedPosts,
  createPost,
  updatePost,
  deletePost,
  getLikes,
  toggleLike,
  toggleBookmark,
  checkBookmark
} from '../controllers/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes

// Feed route (posts from followed users)
router.get('/feed/:userId', getFeedPosts);

// Explore route (must be before /:id)
router.get('/explore', getExplorePosts);

// User posts route (must be before /:id)
router.get('/user/:userId', getUserPosts);

// Bookmarks routes (must be before /:id)
router.get('/bookmarks/check', checkBookmark);
router.get('/bookmarks/:userId', getBookmarkedPosts);

// Base route
router.get('/', getAllPosts);

// Create post
router.post('/', createPost);

// Single post by ID (this catches any other pattern, so must be last for GET)
router.get('/:id', getPost);
router.put('/:id', optionalAuth, updatePost);
router.delete('/:id', optionalAuth, deletePost);

export default router;
