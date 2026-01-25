import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { userAPI, relationshipAPI } from "../services/api";
import { UserPlus, Users } from "lucide-react";

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
    setFollowingIds(prev => new Set([...prev, followedUserId]));
    
    try {
      await relationshipAPI.follow(currentUser.id, followedUserId);
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
      setFollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(followedUserId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="card-flat p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-gray-400" />
          <span className="font-semibold text-gray-600">Suggested for you</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-4 skeleton rounded-lg w-24 mb-2" />
                <div className="h-3 skeleton rounded-lg w-16" />
              </div>
              <div className="w-20 h-8 skeleton rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-flat p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-indigo-500" />
          <span className="font-semibold text-gray-800">Suggested for you</span>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          See All
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group flex-1 min-w-0">
              <div className="avatar-ring flex-shrink-0">
                <img 
                  src={user.profilePic || user.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                  alt={user.username} 
                  className="w-11 h-11 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-400 truncate">Suggested for you</p>
              </div>
            </Link>

            <button
              onClick={() => handleFollow(user.id)}
              disabled={followingIds.has(user.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                followingIds.has(user.id)
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-200 hover:shadow-lg'
              }`}
            >
              {followingIds.has(user.id) ? (
                'Following'
              ) : (
                <>
                  <UserPlus size={14} />
                  Follow
                </>
              )}
            </button>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
