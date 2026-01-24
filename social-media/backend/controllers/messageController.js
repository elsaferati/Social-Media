import Message from '../models/Message.js';

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'senderId and receiverId are required' });
    }

    const messages = await Message.getConversation(senderId, receiverId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'senderId, receiverId, and content are required' });
    }

    const messageId = await Message.create({ senderId, receiverId, content });
    const message = await Message.findById(messageId);

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check ownership (unless admin)
    if (req.user && req.user.id !== message.senderId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await Message.delete(messageId);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Message.getRecentConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
