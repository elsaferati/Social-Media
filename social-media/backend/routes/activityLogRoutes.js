import express from 'express';
import {
  getAllLogs,
  getLog,
  getUserLogs,
  createLog,
  updateLog,
  deleteLog,
  cleanupOldLogs,
  getSummary,
  getActionCounts
} from '../controllers/activityLogController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// All routes are admin-only
router.use(authenticateToken, isAdmin);

// Get routes
router.get('/', getAllLogs);
router.get('/summary', getSummary);
router.get('/action-counts', getActionCounts);
router.get('/user/:userId', getUserLogs);
router.get('/:id', getLog);

// CRUD routes
router.post('/', createLog);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);

// Maintenance
router.delete('/cleanup/old', cleanupOldLogs);

export default router;
