import User from '../models/User.js';
import Post from '../models/Post.js';

// Search users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.search(query, limit);
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 20;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const posts = await Post.search(query, limit);
    res.json(posts);
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search all (users and posts)
export const searchAll = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const [users, posts] = await Promise.all([
      User.search(query, 5),
      Post.search(query, 10)
    ]);

    res.json({ users, posts });
  } catch (error) {
    console.error('Search all error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
