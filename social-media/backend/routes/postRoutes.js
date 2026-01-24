import express from 'express';
import {
  getAllPosts,
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

// Public routes
router.get('/', getAllPosts);
router.get('/explore', getExplorePosts);
router.get('/user/:userId', getUserPosts);
router.get('/bookmarks/:userId', getBookmarkedPosts);
router.get('/:id', getPost);

// Likes routes
router.get('/likes', getLikes);
router.post('/likes', toggleLike);

// Bookmarks routes
router.get('/bookmarks/check', checkBookmark);
router.post('/bookmarks', toggleBookmark);

// Protected routes
router.post('/', createPost);
router.put('/:id', optionalAuth, updatePost);
router.delete('/:id', optionalAuth, deletePost);

export default router;
