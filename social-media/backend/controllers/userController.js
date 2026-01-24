import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Relationship from '../models/Relationship.js';
import Notification from '../models/Notification.js';

// Get user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password if provided
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user
    const updatedUser = await User.update(userId, {
      username: username || existingUser.username,
      email: email || existingUser.email,
      password: hashedPassword,
      bio
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get suggested users
export const getSuggestions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const suggestions = await User.getSuggestions(userId);
    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get friends (users that the user follows)
export const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friends = await User.getFriends(userId);
    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.body;

    if (followerUserId === followedUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if already following
    const exists = await Relationship.exists(followerUserId, followedUserId);
    if (exists) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    await Relationship.follow(followerUserId, followedUserId);

    // Create notification
    await Notification.createFollowNotification(followedUserId, followerUserId);

    res.json({ message: 'Following' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.query;

    await Relationship.unfollow(followerUserId, followedUserId);

    res.json({ message: 'Unfollowed' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get follower/following counts
export const getRelationshipCounts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const counts = await Relationship.getCounts(userId);
    res.json(counts);
  } catch (error) {
    console.error('Get counts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if following
export const checkFollowing = async (req, res) => {
  try {
    const { followerUserId, followedUserId } = req.query;
    const isFollowing = await Relationship.exists(followerUserId, followedUserId);
    res.json({ isFollowing });
  } catch (error) {
    console.error('Check following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get followers list
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const followers = await Relationship.getFollowers(userId);
    res.json(followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get following list
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const following = await Relationship.getFollowing(userId);
    res.json(following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
