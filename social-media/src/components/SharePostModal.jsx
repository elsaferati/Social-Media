import React, { useState, useEffect } from 'react';
import { X, Send, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, messageAPI, getAvatarUrl } from '../services/api';

const SharePostModal = ({ isOpen, onClose, post, postAuthor }) => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isOpen && currentUser?.id) {
      fetchFriends();
    }
  }, [isOpen, currentUser?.id]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friends);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredFriends(friends.filter(f => 
        f.username?.toLowerCase().includes(q)
      ));
    }
  }, [searchQuery, friends]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getFriends(currentUser.id);
      setFriends(data || []);
      setFilteredFriends(data || []);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (friend) => {
    if (!post || !currentUser) return;
    
    const shareLink = `${window.location.origin}/profile/${post.userId}`;
    const postPreview = post.content ? post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '') : '';
    const content = postPreview 
      ? `Check out this post from @${postAuthor}: "${postPreview}" ${shareLink}`
      : `Check out this post from @${postAuthor}: ${shareLink}`;

    try {
      setSending(friend.id);
      await messageAPI.send(currentUser.id, friend.id, content);
      setSuccess(friend.id);
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Error sharing post:', err);
      alert('Failed to share post. Please try again.');
    } finally {
      setSending(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Share Post</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[#7E22CE] focus:ring-1 focus:ring-[#7E22CE] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#7E22CE] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="py-12 text-center">
              <Send className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No friends found' : 'No friends yet. Follow people to share with them!'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleShare(friend)}
                  disabled={sending !== null}
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all ${
                    success === friend.id 
                      ? 'bg-green-50' 
                      : 'hover:bg-gray-50'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <img
                    src={getAvatarUrl(friend.profilePic)}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{friend.username}</p>
                  </div>
                  {sending === friend.id ? (
                    <div className="w-5 h-5 border-2 border-[#7E22CE] border-t-transparent rounded-full animate-spin" />
                  ) : success === friend.id ? (
                    <span className="text-green-600 text-sm font-medium">Sent!</span>
                  ) : (
                    <Send className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
