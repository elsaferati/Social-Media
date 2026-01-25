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
        setUsers([]);
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
          <span className="text-sm font-semibold text-[#64748B]">Suggested for you</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1">
                <div className="h-3 skeleton rounded w-24 mb-2" />
                <div className="h-2 skeleton rounded w-16" />
              </div>
              <div className="w-16 h-8 skeleton rounded-[10px]" />
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
        <span className="text-sm font-semibold text-[#64748B]">Suggested for you</span>
        <button className="text-xs font-semibold text-[#7E22CE] hover:text-[#6B21A8] transition-colors">
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
                className="w-10 h-10 rounded-full object-cover bg-[#F1F5F9]"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[#1E293B] group-hover:text-[#7E22CE] transition-colors truncate">
                  {user.username}
                </p>
                <p className="text-xs text-[#94A3B8] truncate">Suggested for you</p>
              </div>
            </Link>

            <button
              onClick={() => handleFollow(user.id)}
              disabled={followingIds.has(user.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
                followingIds.has(user.id)
                  ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                  : 'bg-[#7E22CE] text-white hover:bg-[#6B21A8] shadow-sm'
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
          <div className="text-center py-4">
            <p className="text-[#64748B] text-sm">No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
