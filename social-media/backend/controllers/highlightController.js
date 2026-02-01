import Highlight from '../models/Highlight.js';

// Get highlights for a user (public - anyone can see)
export const getHighlights = async (req, res) => {
  try {
    const userId = req.params.userId;
    const highlights = await Highlight.getByUserId(userId);
    res.json(highlights);
  } catch (error) {
    console.error('Get highlights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stories in a highlight (public - for viewing)
export const getHighlightStories = async (req, res) => {
  try {
    const highlightId = req.params.highlightId;
    const highlight = await Highlight.findById(highlightId);
    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }
    const stories = await Highlight.getStories(highlightId);
    res.json(stories);
  } catch (error) {
    console.error('Get highlight stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create highlight (from archived stories)
export const createHighlight = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, storyIds } = req.body;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Highlight name is required' });
    }
    if (!Array.isArray(storyIds) || storyIds.length === 0) {
      return res.status(400).json({ message: 'Select at least one story from your archive' });
    }
    const highlightId = await Highlight.create({ userId, name: name.trim(), storyIds });
    const highlights = await Highlight.getByUserId(userId);
    const created = highlights.find((h) => h.id === highlightId);
    res.status(201).json(created || { id: highlightId, name: name.trim(), userId });
  } catch (error) {
    console.error('Create highlight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete highlight
export const deleteHighlight = async (req, res) => {
  try {
    const highlightId = req.params.id;
    const highlight = await Highlight.findById(highlightId);
    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }
    if (req.user?.id !== highlight.userId) {
      return res.status(403).json({ message: 'You can only delete your own highlights' });
    }
    await Highlight.delete(highlightId);
    res.json({ message: 'Highlight deleted' });
  } catch (error) {
    console.error('Delete highlight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
