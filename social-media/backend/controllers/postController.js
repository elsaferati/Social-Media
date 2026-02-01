import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const posts = await Post.getAll(page, limit);
    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feed posts (posts from followed users + own posts)
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const posts = await Post.getFeed(userId, page, limit);
    res.json(posts);
  } catch (error) {
    console.error('Get feed posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts by user
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.getByUserId(req.params.userId);
    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get explore posts
export const getExplorePosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const posts = await Post.getExplore(limit);
    res.json(posts);
  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookmarked posts
export const getBookmarkedPosts = async (req, res) => {
  try {
    const posts = await Post.getBookmarked(req.params.userId);
    res.json(posts);
  } catch (error) {
    console.error('Get bookmarked posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const content = req.body?.content || '';
    const userId = req.body?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Check if there's content or an image
    if (!content && !req.file) {
      return res.status(400).json({ message: 'Content or image is required' });
    }

    // Get image URL if file was uploaded
    let imgUrl = null;
    if (req.file) {
      imgUrl = `/uploads/${req.file.filename}`;
    }

    const postId = await Post.create({ 
      content: content, 
      userId: parseInt(userId), 
      img: imgUrl 
    });
    const post = await Post.findById(postId);

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    // Check if post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== existingPost.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const updatedPost = await Post.update(postId, { content });
    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== existingPost.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.delete(postId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get likes for a post (array of user IDs)
export const getLikes = async (req, res) => {
  try {
    const postId = req.query.postId;
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }
    const likes = await Like.getByPostId(postId);
    res.json(likes);
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get likers with user info (who liked this post)
export const getLikers = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }
    const likers = await Like.getLikersWithUser(postId);
    res.json(likers);
  } catch (error) {
    console.error('Get likers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ message: 'userId and postId are required' });
    }

    // Get post owner for notification
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const liked = await Like.toggle(userId, postId);

    // Create notification if liked and not own post
    if (liked && post.userId !== userId) {
      await Notification.createLikeNotification(post.userId, userId, postId);
    }

    res.json({ 
      message: liked ? 'Post liked' : 'Post unliked',
      liked 
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ message: 'userId and postId are required' });
    }

    const bookmarked = await Bookmark.toggle(userId, postId);

    res.json({ 
      message: bookmarked ? 'Bookmark saved' : 'Bookmark removed',
      bookmarked 
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if post is bookmarked
export const checkBookmark = async (req, res) => {
  try {
    const { userId, postId } = req.query;
    if (!userId || !postId) {
      return res.status(400).json({ message: 'userId and postId are required' });
    }
    const isBookmarked = await Bookmark.exists(userId, postId);
    res.json(isBookmarked);
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
