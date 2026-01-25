import express from 'express';
import {
  getAllReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  getPendingCount,
  getReportStats
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// User routes (creating reports)
router.post('/', createReport);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllReports);
router.get('/stats', authenticateToken, isAdmin, getReportStats);
router.get('/pending/count', authenticateToken, isAdmin, getPendingCount);
router.get('/:id', authenticateToken, isAdmin, getReport);
router.put('/:id', authenticateToken, isAdmin, updateReport);
router.delete('/:id', authenticateToken, isAdmin, deleteReport);

export default router;
