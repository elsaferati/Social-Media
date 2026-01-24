import express from 'express';
import {
  searchUsers,
  searchPosts,
  searchAll
} from '../controllers/searchController.js';

const router = express.Router();

// Search routes
router.get('/users', searchUsers);
router.get('/posts', searchPosts);
router.get('/', searchAll);

export default router;
