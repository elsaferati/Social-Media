import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { userAPI, relationshipAPI } from "../services/api";
import { UserPlus } from "lucide-react";

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
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-[#6B7280]">Suggested for you</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-3 skeleton rounded w-24 mb-2" />
                <div className="h-2 skeleton rounded w-16" />
              </div>
              <div className="w-16 h-8 skeleton rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#6B7280]">Suggested for you</span>
        <button className="text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
          See All
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group flex-1 min-w-0">
              <img 
                src={user.profilePic || user.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                alt={user.username} 
                className="w-10 h-10 rounded-full object-cover bg-[#F3F4F6]"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[#1F2937] group-hover:text-[#6366F1] transition-colors truncate">
                  {user.username}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate">Suggested for you</p>
              </div>
            </Link>

            <button
              onClick={() => handleFollow(user.id)}
              disabled={followingIds.has(user.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                followingIds.has(user.id)
                  ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
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
            <p className="text-[#6B7280] text-sm">No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
