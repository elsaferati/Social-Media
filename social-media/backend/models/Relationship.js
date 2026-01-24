import db from '../config/db.js';

const Relationship = {
  // Check if user follows another user
  exists: async (followerUserId, followedUserId) => {
    const [rows] = await db.query(
      'SELECT * FROM relationships WHERE followerUserId = ? AND followedUserId = ?',
      [followerUserId, followedUserId]
    );
    return rows.length > 0;
  },

  // Follow a user
  follow: async (followerUserId, followedUserId) => {
    await db.query(
      'INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)',
      [followerUserId, followedUserId]
    );
  },

  // Unfollow a user
  unfollow: async (followerUserId, followedUserId) => {
    await db.query(
      'DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?',
      [followerUserId, followedUserId]
    );
  },

  // Get follower count
  getFollowerCount: async (userId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM relationships WHERE followedUserId = ?',
      [userId]
    );
    return rows[0].count;
  },

  // Get following count
  getFollowingCount: async (userId) => {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM relationships WHERE followerUserId = ?',
      [userId]
    );
    return rows[0].count;
  },

  // Get counts (both)
  getCounts: async (userId) => {
    const followers = await Relationship.getFollowerCount(userId);
    const following = await Relationship.getFollowingCount(userId);
    return { followers, following };
  },

  // Get followers list
  getFollowers: async (userId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.profilePic 
       FROM relationships r
       JOIN users u ON r.followerUserId = u.id
       WHERE r.followedUserId = ?`,
      [userId]
    );
    return rows;
  },

  // Get following list
  getFollowing: async (userId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.profilePic 
       FROM relationships r
       JOIN users u ON r.followedUserId = u.id
       WHERE r.followerUserId = ?`,
      [userId]
    );
    return rows;
  }
};

export default Relationship;
