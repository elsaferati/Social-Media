import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { likeAPI, getAvatarUrl } from '../services/api';

const LikesModal = ({ isOpen, onClose, postId }) => {
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && postId) {
      fetchLikers();
    }
  }, [isOpen, postId]);

  const fetchLikers = async () => {
    try {
      setLoading(true);
      const data = await likeAPI.getLikers(postId);
      setLikers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching likers:', err);
      setLikers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Liked by</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : likers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold mb-1">No likes yet</p>
              <p className="text-sm text-gray-500">Be the first to like this post!</p>
            </div>
          ) : (
            likers.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img
                  src={getAvatarUrl(user.profilePic)}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold text-gray-900">{user.username}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;
