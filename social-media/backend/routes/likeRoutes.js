import express from 'express';
import { getLikes, toggleLike } from '../controllers/postController.js';

const router = express.Router();

// GET /api/likes?postId=123
router.get('/', getLikes);

// POST /api/likes
router.post('/', toggleLike);

export default router;
