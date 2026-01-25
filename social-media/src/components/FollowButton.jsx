import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { relationshipAPI } from "../services/api";
import { UserPlus, UserCheck } from "lucide-react";

const FollowButton = ({ userId, initialFollowed = false, onFollowChange, fullWidth = false }) => {
  const { currentUser } = useAuth();
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);

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
        px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${isFollowed 
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          : "gradient-bg text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
        }
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFollowed ? (
        <UserCheck size={18} />
      ) : (
        <UserPlus size={18} />
      )}
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
