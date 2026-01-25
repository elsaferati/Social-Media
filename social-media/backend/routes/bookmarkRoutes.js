import express from 'express';
import { toggleBookmark, checkBookmark } from '../controllers/postController.js';

const router = express.Router();

// GET /api/bookmarks/check?userId=1&postId=2
router.get('/check', checkBookmark);

// POST /api/bookmarks
router.post('/', toggleBookmark);

export default router;
