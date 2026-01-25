import ActivityLog from '../models/ActivityLog.js';

// Get all logs (admin)
export const getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const filters = {};
    if (req.query.userId) filters.userId = parseInt(req.query.userId);
    if (req.query.action) filters.action = req.query.action;
    if (req.query.entityType) filters.entityType = req.query.entityType;
    if (req.query.startDate) filters.startDate = req.query.startDate;
    if (req.query.endDate) filters.endDate = req.query.endDate;

    const result = await ActivityLog.getAll(page, limit, filters);
    res.json(result);
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single log
export const getLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logs by user
export const getUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 50;

    const logs = await ActivityLog.getByUserId(userId, limit);
    res.json(logs);
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create log (for manual logging or testing)
export const createLog = async (req, res) => {
  try {
    const { userId, action, entityType, entityId, details } = req.body;

    if (!action || !entityType) {
      return res.status(400).json({ message: 'action and entityType are required' });
    }

    const logId = await ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    const log = await ActivityLog.findById(logId);
    res.status(201).json(log);
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update log
export const updateLog = async (req, res) => {
  try {
    const { action, entityType, entityId, details } = req.body;
    const logId = req.params.id;

    const existingLog = await ActivityLog.findById(logId);
    if (!existingLog) {
      return res.status(404).json({ message: 'Log not found' });
    }

    const updatedLog = await ActivityLog.update(logId, { action, entityType, entityId, details });
    res.json(updatedLog);
  } catch (error) {
    console.error('Update log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete log
export const deleteLog = async (req, res) => {
  try {
    const logId = req.params.id;

    const existingLog = await ActivityLog.findById(logId);
    if (!existingLog) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await ActivityLog.delete(logId);
    res.json({ message: 'Log deleted' });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete old logs (cleanup)
export const cleanupOldLogs = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const deletedCount = await ActivityLog.deleteOlderThan(days);
    
    res.json({ message: `Deleted ${deletedCount} logs older than ${days} days` });
  } catch (error) {
    console.error('Cleanup old logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get activity summary
export const getSummary = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const summary = await ActivityLog.getSummary(days);
    res.json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get action counts
export const getActionCounts = async (req, res) => {
  try {
    const counts = await ActivityLog.getActionCounts();
    res.json(counts);
  } catch (error) {
    console.error('Get action counts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
