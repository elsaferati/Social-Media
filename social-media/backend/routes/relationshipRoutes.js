import express from 'express';
import { followUser, unfollowUser, getRelationshipCounts } from '../controllers/userController.js';

const router = express.Router();

// Relationship routes
router.post('/', followUser);
router.delete('/', unfollowUser);
router.get('/count/:userId', getRelationshipCounts);

export default router;
