import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { userAPI, relationshipAPI } from "../services/api";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getSuggestions(currentUser.id);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        // Fallback dummy data if API fails
        setUsers([
          { id: 99, username: "design_daily", profilePic: "https://i.pravatar.cc/150?img=12" },
          { id: 98, username: "travel_mike", profilePic: "https://i.pravatar.cc/150?img=15" },
          { id: 97, username: "code_guru", profilePic: "https://i.pravatar.cc/150?img=8" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchSuggestions();
    }
  }, [currentUser]);

  const handleFollow = async (followedUserId) => {
    // Optimistic update - add to following set
    setFollowingIds(prev => new Set([...prev, followedUserId]));
    
    try {
      await relationshipAPI.follow(currentUser.id, followedUserId);
      // Remove from suggestions after successful follow
      setTimeout(() => {
        setUsers(users.filter((u) => u.id !== followedUserId));
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(followedUserId);
          return newSet;
        });
      }, 1000);
    } catch (err) {
      console.error('Error following user:', err);
      // Revert on error
      setFollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(followedUserId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-500">Suggested for you</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-gray-500">Suggested for you</span>
        <button className="text-xs font-semibold text-gray-900 hover:text-gray-600">See All</button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user.profilePic || user.img ? (
                  <img 
                    src={user.profilePic || user.img || `https://i.pravatar.cc/150?u=${user.id}`} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Text */}
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800 group-hover:text-gray-600">
                  {user.username}
                </span>
                <span className="text-xs text-gray-400">Suggested for you</span>
              </div>
            </Link>

            {/* Action */}
            <button
              onClick={() => handleFollow(user.id)}
              disabled={followingIds.has(user.id)}
              className={`text-xs font-bold transition ${
                followingIds.has(user.id)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              {followingIds.has(user.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-gray-400 text-xs text-center py-4">No suggestions available</p>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-8 flex flex-wrap gap-2 text-[11px] text-gray-300">
        <span>About</span> <span>•</span> <span>Help</span> <span>•</span> 
        <span>API</span> <span>•</span> <span>Privacy</span>
      </div>
      <div className="mt-4 text-[11px] text-gray-300">
        © 2026 MY SOCIAL APP
      </div>
    </div>
  );
};

export default SuggestedUsers;
