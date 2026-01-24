import db from '../config/db.js';

const Message = {
  // Get messages between two users
  getConversation: async (senderId, receiverId) => {
    const [rows] = await db.query(
      `SELECT * FROM messages 
       WHERE (senderId = ? AND receiverId = ?) 
       OR (senderId = ? AND receiverId = ?)
       ORDER BY createdAt ASC`,
      [senderId, receiverId, receiverId, senderId]
    );
    return rows;
  },

  // Get all messages for admin (paginated)
  getAllAdmin: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT m.*, 
             s.username as senderUsername, s.profilePic as senderPic,
             r.username as receiverUsername, r.profilePic as receiverPic
       FROM messages m 
       JOIN users s ON m.senderId = s.id
       JOIN users r ON m.receiverId = r.id
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM messages m 
      JOIN users s ON m.senderId = s.id
      JOIN users r ON m.receiverId = r.id
    `;
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE m.content LIKE ? OR s.username LIKE ? OR r.username LIKE ?';
      countQuery += ' WHERE m.content LIKE ? OR s.username LIKE ? OR r.username LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY m.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      messages: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get single message
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create message
  create: async ({ senderId, receiverId, content }) => {
    const [result] = await db.query(
      'INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );
    return result.insertId;
  },

  // Delete message
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM messages WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM messages');
    return rows[0].count;
  },

  // Get recent conversations for a user
  getRecentConversations: async (userId) => {
    const [rows] = await db.query(
      `SELECT DISTINCT 
         CASE 
           WHEN senderId = ? THEN receiverId 
           ELSE senderId 
         END as partnerId,
         MAX(createdAt) as lastMessageTime
       FROM messages 
       WHERE senderId = ? OR receiverId = ?
       GROUP BY partnerId
       ORDER BY lastMessageTime DESC`,
      [userId, userId, userId]
    );
    return rows;
  }
};

export default Message;
