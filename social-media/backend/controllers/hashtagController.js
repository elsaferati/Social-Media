import Hashtag from '../models/Hashtag.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all hashtags (admin)
export const getAllHashtags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await Hashtag.getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get all hashtags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single hashtag
export const getHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.id);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }
    res.json(hashtag);
  } catch (error) {
    console.error('Get hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get hashtag by name
export const getHashtagByName = async (req, res) => {
  try {
    const hashtag = await Hashtag.findByName(req.params.name);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }
    res.json(hashtag);
  } catch (error) {
    console.error('Get hashtag by name error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending hashtags
export const getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const hashtags = await Hashtag.getTrending(limit);
    res.json(hashtags);
  } catch (error) {
    console.error('Get trending hashtags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create hashtag
export const createHashtag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Hashtag name is required' });
    }

    // Check if already exists
    const existing = await Hashtag.findByName(name);
    if (existing) {
      return res.status(400).json({ message: 'Hashtag already exists' });
    }

    const hashtagId = await Hashtag.create(name);
    const hashtag = await Hashtag.findById(hashtagId);

    // Log activity
    await ActivityLog.logUserAction(req, 'create_hashtag', 'hashtag', hashtagId, { name });

    res.status(201).json(hashtag);
  } catch (error) {
    console.error('Create hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update hashtag
export const updateHashtag = async (req, res) => {
  try {
    const { name, isBlocked } = req.body;
    const hashtagId = req.params.id;

    const existingHashtag = await Hashtag.findById(hashtagId);
    if (!existingHashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    const updatedHashtag = await Hashtag.update(hashtagId, { name, isBlocked });

    // Log activity
    await ActivityLog.logUserAction(req, 'update_hashtag', 'hashtag', hashtagId, { 
      oldName: existingHashtag.name,
      newName: name,
      isBlocked
    });

    res.json(updatedHashtag);
  } catch (error) {
    console.error('Update hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete hashtag
export const deleteHashtag = async (req, res) => {
  try {
    const hashtagId = req.params.id;

    const existingHashtag = await Hashtag.findById(hashtagId);
    if (!existingHashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    await Hashtag.delete(hashtagId);

    // Log activity
    await ActivityLog.logUserAction(req, 'delete_hashtag', 'hashtag', hashtagId, { 
      name: existingHashtag.name 
    });

    res.json({ message: 'Hashtag deleted' });
  } catch (error) {
    console.error('Delete hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle block status
export const toggleBlock = async (req, res) => {
  try {
    const hashtagId = req.params.id;

    const hashtag = await Hashtag.findById(hashtagId);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    const updatedHashtag = await Hashtag.update(hashtagId, { isBlocked: !hashtag.isBlocked });

    // Log activity
    await ActivityLog.logUserAction(req, hashtag.isBlocked ? 'unblock_hashtag' : 'block_hashtag', 'hashtag', hashtagId);

    res.json(updatedHashtag);
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search hashtags
export const searchHashtags = async (req, res) => {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const hashtags = await Hashtag.search(query, limit);
    res.json(hashtags);
  } catch (error) {
    console.error('Search hashtags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts by hashtag
export const getPostsByHashtag = async (req, res) => {
  try {
    const hashtagId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const hashtag = await Hashtag.findById(hashtagId);
    if (!hashtag) {
      return res.status(404).json({ message: 'Hashtag not found' });
    }

    const posts = await Hashtag.getPostsByHashtag(hashtagId, page, limit);
    res.json({ hashtag, posts });
  } catch (error) {
    console.error('Get posts by hashtag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
