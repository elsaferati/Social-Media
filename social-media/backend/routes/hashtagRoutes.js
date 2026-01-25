import express from 'express';
import {
  getAllHashtags,
  getHashtag,
  getHashtagByName,
  getTrending,
  createHashtag,
  updateHashtag,
  deleteHashtag,
  toggleBlock,
  searchHashtags,
  getPostsByHashtag
} from '../controllers/hashtagController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrending);
router.get('/search', searchHashtags);
router.get('/name/:name', getHashtagByName);
router.get('/:id/posts', getPostsByHashtag);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllHashtags);
router.post('/', authenticateToken, isAdmin, createHashtag);
router.get('/:id', getHashtag);
router.put('/:id', authenticateToken, isAdmin, updateHashtag);
router.delete('/:id', authenticateToken, isAdmin, deleteHashtag);
router.post('/:id/toggle-block', authenticateToken, isAdmin, toggleBlock);

export default router;
