import db from '../config/db.js';

const Report = {
  // Find report by ID (reportedUsername from reported user or post author when reporting a post)
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT r.*, 
        reporter.username as reporterUsername, reporter.profilePic as reporterProfilePic,
        COALESCE(reported.username, postAuthor.username) as reportedUsername,
        COALESCE(reported.profilePic, postAuthor.profilePic) as reportedProfilePic,
        p.content as postContent
       FROM reports r
       JOIN users reporter ON r.reporterUserId = reporter.id
       LEFT JOIN users reported ON r.reportedUserId = reported.id
       LEFT JOIN posts p ON r.reportedPostId = p.id
       LEFT JOIN users postAuthor ON p.userId = postAuthor.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get all reports (paginated, for admin). reportedUsername = reported user or post author when post reported
  getAll: async (page = 1, limit = 10, status = null, reportType = null) => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT r.*, 
        reporter.username as reporterUsername, reporter.profilePic as reporterProfilePic,
        COALESCE(reported.username, postAuthor.username) as reportedUsername,
        COALESCE(reported.profilePic, postAuthor.profilePic) as reportedProfilePic
       FROM reports r
       JOIN users reporter ON r.reporterUserId = reporter.id
       LEFT JOIN users reported ON r.reportedUserId = reported.id
       LEFT JOIN posts p ON r.reportedPostId = p.id
       LEFT JOIN users postAuthor ON p.userId = postAuthor.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM reports r';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (status) {
      conditions.push('r.status = ?');
      params.push(status);
      countParams.push(status);
    }

    if (reportType) {
      conditions.push('r.reportType = ?');
      params.push(reportType);
      countParams.push(reportType);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY r.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      reports: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get reports by status
  getByStatus: async (status) => {
    const [rows] = await db.query(
      `SELECT r.*, reporter.username as reporterUsername
       FROM reports r
       JOIN users reporter ON r.reporterUserId = reporter.id
       WHERE r.status = ?
       ORDER BY r.createdAt DESC`,
      [status]
    );
    return rows;
  },

  // Create new report
  create: async ({ reporterUserId, reportedUserId = null, reportedPostId = null, reportType, reason, description = null }) => {
    const [result] = await db.query(
      `INSERT INTO reports (reporterUserId, reportedUserId, reportedPostId, reportType, reason, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reporterUserId, reportedUserId, reportedPostId, reportType, reason, description]
    );
    return result.insertId;
  },

  // Update report (for admin review)
  update: async (id, { status, adminNotes }) => {
    const fields = [];
    const values = [];
    
    if (status !== undefined) { 
      fields.push('status = ?'); 
      values.push(status);
      if (status === 'resolved' || status === 'dismissed') {
        fields.push('resolvedAt = NOW()');
      }
    }
    if (adminNotes !== undefined) { fields.push('adminNotes = ?'); values.push(adminNotes); }
    
    if (fields.length === 0) return Report.findById(id);
    
    values.push(id);
    await db.query(`UPDATE reports SET ${fields.join(', ')} WHERE id = ?`, values);
    return Report.findById(id);
  },

  // Delete report
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM reports WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count reports by status
  countByStatus: async () => {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) as count FROM reports GROUP BY status
    `);
    return rows;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM reports');
    return rows[0].count;
  },

  // Get pending count
  countPending: async () => {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
    return rows[0].count;
  }
};

export default Report;
