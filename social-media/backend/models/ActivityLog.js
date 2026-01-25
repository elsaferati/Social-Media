import db from '../config/db.js';

const ActivityLog = {
  // Find log by ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT al.*, u.username, u.profilePic
       FROM activity_logs al
       LEFT JOIN users u ON al.userId = u.id
       WHERE al.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get all logs (paginated, for admin)
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT al.*, u.username, u.profilePic
      FROM activity_logs al
      LEFT JOIN users u ON al.userId = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM activity_logs al';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (filters.userId) {
      conditions.push('al.userId = ?');
      params.push(filters.userId);
      countParams.push(filters.userId);
    }

    if (filters.action) {
      conditions.push('al.action LIKE ?');
      params.push(`%${filters.action}%`);
      countParams.push(`%${filters.action}%`);
    }

    if (filters.entityType) {
      conditions.push('al.entityType = ?');
      params.push(filters.entityType);
      countParams.push(filters.entityType);
    }

    if (filters.startDate) {
      conditions.push('al.createdAt >= ?');
      params.push(filters.startDate);
      countParams.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('al.createdAt <= ?');
      params.push(filters.endDate);
      countParams.push(filters.endDate);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY al.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      logs: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get logs by user
  getByUserId: async (userId, limit = 50) => {
    const [rows] = await db.query(
      `SELECT * FROM activity_logs WHERE userId = ? ORDER BY createdAt DESC LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  // Create new log entry
  create: async ({ userId = null, action, entityType, entityId = null, details = null, ipAddress = null, userAgent = null }) => {
    const [result] = await db.query(
      `INSERT INTO activity_logs (userId, action, entityType, entityId, details, ipAddress, userAgent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, details ? JSON.stringify(details) : null, ipAddress, userAgent]
    );
    return result.insertId;
  },

  // Update log (rarely needed, but for completeness)
  update: async (id, { action, entityType, entityId, details }) => {
    const fields = [];
    const values = [];
    
    if (action !== undefined) { fields.push('action = ?'); values.push(action); }
    if (entityType !== undefined) { fields.push('entityType = ?'); values.push(entityType); }
    if (entityId !== undefined) { fields.push('entityId = ?'); values.push(entityId); }
    if (details !== undefined) { fields.push('details = ?'); values.push(JSON.stringify(details)); }
    
    if (fields.length === 0) return ActivityLog.findById(id);
    
    values.push(id);
    await db.query(`UPDATE activity_logs SET ${fields.join(', ')} WHERE id = ?`, values);
    return ActivityLog.findById(id);
  },

  // Delete log
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM activity_logs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Delete old logs (cleanup)
  deleteOlderThan: async (days = 90) => {
    const [result] = await db.query(
      'DELETE FROM activity_logs WHERE createdAt < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
    return result.affectedRows;
  },

  // Get activity summary (for dashboard)
  getSummary: async (days = 7) => {
    const [rows] = await db.query(`
      SELECT 
        DATE(createdAt) as date,
        action,
        COUNT(*) as count
      FROM activity_logs
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(createdAt), action
      ORDER BY date DESC, count DESC
    `, [days]);
    return rows;
  },

  // Get action counts
  getActionCounts: async () => {
    const [rows] = await db.query(`
      SELECT action, COUNT(*) as count 
      FROM activity_logs 
      GROUP BY action 
      ORDER BY count DESC
    `);
    return rows;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM activity_logs');
    return rows[0].count;
  },

  // Helper: Log user action
  logUserAction: async (req, action, entityType, entityId = null, details = null) => {
    return ActivityLog.create({
      userId: req.user?.id || null,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent']
    });
  },

  // Helper: Log system action
  logSystemAction: async (action, entityType, entityId = null, details = null) => {
    return ActivityLog.create({
      userId: null,
      action,
      entityType,
      entityId,
      details
    });
  }
};

export default ActivityLog;
