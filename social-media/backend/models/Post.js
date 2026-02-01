import db from '../config/db.js';

const Post = {
  // Get all posts with user info
  getAll: async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       ORDER BY p.createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  },

  // Get feed posts (from followed users + own posts)
  getFeed: async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.userId = ? 
       OR p.userId IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
       ORDER BY p.createdAt DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, limit, offset]
    );
    return rows;
  },

  // Get all posts for admin (paginated with search)
  getAllAdmin: async (page = 1, limit = 10, search = '') => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, u.username, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM posts p JOIN users u ON p.userId = u.id';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' WHERE p.content LIKE ? OR u.username LIKE ?';
      countQuery += ' WHERE p.content LIKE ? OR u.username LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, countParams);

    return {
      posts: rows,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  },

  // Get single post by ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get posts by user ID (with like and comment counts)
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS \`likeCount\`,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS \`commentCount\`
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.userId = ? 
       ORDER BY p.createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Get explore posts (newest first)
  getExplore: async (limit = 20) => {
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       ORDER BY p.createdAt DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  // Get bookmarked posts by user
  getBookmarked: async (userId) => {
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM bookmarks b
       JOIN posts p ON b.postId = p.id
       JOIN users u ON p.userId = u.id
       WHERE b.userId = ?
       ORDER BY b.createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Create new post
  create: async ({ content, userId, img = null }) => {
    const [result] = await db.query(
      'INSERT INTO posts (content, userId, img) VALUES (?, ?, ?)',
      [content, userId, img]
    );
    return result.insertId;
  },

  // Update post
  update: async (id, { content }) => {
    await db.query('UPDATE posts SET content = ? WHERE id = ?', [content, id]);
    return Post.findById(id);
  },

  // Delete post
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Search posts
  search: async (query, limit = 20) => {
    const [rows] = await db.query(
      `SELECT p.*, u.username, u.profilePic 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.content LIKE ?
       ORDER BY p.createdAt DESC
       LIMIT ?`,
      [`%${query}%`, limit]
    );
    return rows;
  },

  // Get total count
  count: async () => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM posts');
    return rows[0].count;
  },

  // Get count by user
  countByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM posts WHERE userId = ?',
      [userId]
    );
    return rows[0].count;
  }
};

export default Post;
