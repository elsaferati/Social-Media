import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { relationshipAPI } from "../services/api";

const FollowButton = ({ userId, initialFollowed = false, onFollowChange }) => {
  const { currentUser } = useAuth();
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);

  // Don't show button for own profile
  if (currentUser?.id === userId) {
    return null;
  }

  const toggleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isFollowed) {
        await relationshipAPI.unfollow(currentUser?.id, userId);
        setIsFollowed(false);
        if (onFollowChange) onFollowChange(false);
      } else {
        await relationshipAPI.follow(currentUser?.id, userId);
        setIsFollowed(true);
        if (onFollowChange) onFollowChange(true);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`
        px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2
        ${isFollowed 
            ? "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading && (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
