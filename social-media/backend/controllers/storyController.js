import Story from '../models/Story.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all stories (for feed)
export const getStories = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const stories = await Story.getActiveStories(userId);
    res.json(stories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single story
export const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stories
export const getUserStories = async (req, res) => {
  try {
    const stories = await Story.getByUserId(req.params.userId);
    res.json(stories);
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create story
export const createStory = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    let imgUrl = null;
    if (req.file) {
      imgUrl = `/uploads/${req.file.filename}`;
    }

    if (!content && !imgUrl) {
      return res.status(400).json({ message: 'Content or image is required' });
    }

    const storyId = await Story.create({ userId, img: imgUrl, content });
    const story = await Story.findById(storyId);

    // Log activity
    await ActivityLog.logUserAction(req, 'create_story', 'story', storyId);

    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update story
export const updateStory = async (req, res) => {
  try {
    const { content, expiresAt } = req.body;
    const storyId = req.params.id;

    const existingStory = await Story.findById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== existingStory.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this story' });
    }

    let imgUrl = existingStory.img;
    if (req.file) {
      imgUrl = `/uploads/${req.file.filename}`;
    }

    const updatedStory = await Story.update(storyId, { content, img: imgUrl, expiresAt });

    // Log activity
    await ActivityLog.logUserAction(req, 'update_story', 'story', storyId);

    res.json(updatedStory);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete story
export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const existingStory = await Story.findById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== existingStory.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await Story.delete(storyId);

    // Log activity
    await ActivityLog.logUserAction(req, 'delete_story', 'story', storyId);

    res.json({ message: 'Story deleted' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View story
export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.body.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const viewed = await Story.addView(storyId, userId);
    res.json({ viewed, message: viewed ? 'Story viewed' : 'Already viewed' });
  } catch (error) {
    console.error('View story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get story viewers
export const getStoryViewers = async (req, res) => {
  try {
    const viewers = await Story.getViewers(req.params.id);
    res.json(viewers);
  } catch (error) {
    console.error('Get story viewers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all stories
export const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const includeExpired = req.query.includeExpired === 'true';
    
    const result = await Story.getAll(page, limit, includeExpired);
    res.json(result);
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete expired stories
export const deleteExpiredStories = async (req, res) => {
  try {
    const count = await Story.deleteExpired();
    
    // Log activity
    await ActivityLog.logSystemAction('cleanup_expired_stories', 'story', null, { deletedCount: count });
    
    res.json({ message: `Deleted ${count} expired stories` });
  } catch (error) {
    console.error('Delete expired stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
