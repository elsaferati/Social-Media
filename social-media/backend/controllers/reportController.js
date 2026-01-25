import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all reports (admin)
export const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;
    const reportType = req.query.reportType || null;

    const result = await Report.getAll(page, limit, status, reportType);
    res.json(result);
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single report
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create report
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reportedPostId, reportType, reason, description } = req.body;
    const reporterUserId = req.body.reporterUserId || req.user?.id;

    if (!reporterUserId) {
      return res.status(400).json({ message: 'reporterUserId is required' });
    }

    if (!reportType || !reason) {
      return res.status(400).json({ message: 'reportType and reason are required' });
    }

    // Validate that at least one target is provided
    if (!reportedUserId && !reportedPostId) {
      return res.status(400).json({ message: 'reportedUserId or reportedPostId is required' });
    }

    const reportId = await Report.create({
      reporterUserId,
      reportedUserId,
      reportedPostId,
      reportType,
      reason,
      description
    });

    const report = await Report.findById(reportId);

    // Log activity
    await ActivityLog.logUserAction(req, 'create_report', 'report', reportId, { reportType, reason });

    res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update report (admin review)
export const updateReport = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const reportId = req.params.id;

    const existingReport = await Report.findById(reportId);
    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updatedReport = await Report.update(reportId, { status, adminNotes });

    // Log activity
    await ActivityLog.logUserAction(req, 'review_report', 'report', reportId, { 
      oldStatus: existingReport.status, 
      newStatus: status 
    });

    res.json(updatedReport);
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const existingReport = await Report.findById(reportId);
    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await Report.delete(reportId);

    // Log activity
    await ActivityLog.logUserAction(req, 'delete_report', 'report', reportId);

    res.json({ message: 'Report deleted' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending reports count
export const getPendingCount = async (req, res) => {
  try {
    const count = await Report.countPending();
    res.json({ count });
  } catch (error) {
    console.error('Get pending count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get report stats
export const getReportStats = async (req, res) => {
  try {
    const byStatus = await Report.countByStatus();
    const total = await Report.count();
    
    res.json({
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
