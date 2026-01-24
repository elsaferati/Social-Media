import db from '../config/db.js';

const Comment = {
  // Get comments for a post
  getByPostId: async (postId) => {
    const [rows] = await db.query(
      `SELECT c.*, u.username, u.profilePic 
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       WHERE c.postId = ?
       ORDER BY c.createdAt ASC`,
      [postId]
    );
    return rows;
  },

  // Get all comments for admin (paginated)
  getAllAdmin: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT c.*, u.username, u.profilePic, p.content as postContent
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       JOIN posts p ON c.postId = p.id
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM comments c 
      JOIN users u ON c.userId = u.id 
      JOIN posts p ON c.postId = p.id
    `;
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE c.content LIKE ? OR u.username LIKE ?';
      countQuery += ' WHERE c.content LIKE ? OR u.username LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      comments: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get single comment
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT c.*, u.username, u.profilePic 
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Create comment
  create: async ({ content, userId, postId }) => {
    const [result] = await db.query(
      'INSERT INTO comments (content, userId, postId) VALUES (?, ?, ?)',
      [content, userId, postId]
    );
    return result.insertId;
  },

  // Update comment
  update: async (id, { content }) => {
    await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
    return Comment.findById(id);
  },

  // Delete comment
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Get count for a post
  countByPost: async (postId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM comments WHERE postId = ?',
      [postId]
    );
    return rows[0].count;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM comments');
    return rows[0].count;
  }
};

export default Comment;
