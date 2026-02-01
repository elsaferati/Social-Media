import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { Settings, MessageCircle, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI, relationshipAPI, postAPI, getAvatarUrl } from "../services/api";

const ProfileHeader = ({ userId }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.id === parseInt(userId);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const [userData, relationshipData, userPosts] = await Promise.all([
        userAPI.getUser(userId),
        relationshipAPI.getCounts(userId),
        postAPI.getByUser(userId)
      ]);

      setUser(userData);
      setStats({
        followers: relationshipData.followers || 0,
        following: relationshipData.following || 0,
        posts: userPosts?.length || 0
      });

      if (currentUser && !isOwnProfile) {
        try {
          const followData = await relationshipAPI.checkFollowing(currentUser.id, userId);
          setIsFollowing(followData.isFollowing);
        } catch (e) {}
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = (followed) => {
    setIsFollowing(followed);
    setStats(prev => ({
      ...prev,
      followers: followed ? prev.followers + 1 : prev.followers - 1
    }));
  };

  if (loading) {
    return (
      <div className="card-flat p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full skeleton" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-7 skeleton rounded-lg w-40 mx-auto md:mx-0" />
            <div className="flex justify-center md:justify-start gap-6">
              <div className="h-5 skeleton rounded w-20" />
              <div className="h-5 skeleton rounded w-20" />
              <div className="h-5 skeleton rounded w-20" />
            </div>
            <div className="h-4 skeleton rounded w-64 mx-auto md:mx-0" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userImage = getAvatarUrl(user.profilePic);

  return (
    <div className="card-flat overflow-hidden">
      {/* Cover banner - enough height so avatar overlap looks clean */}
      <div className="h-36 md:h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Profile Content */}
      <div className="px-4 md:px-8 pb-6">
        {/* Avatar - overlaps banner with clear ring so it doesn't look cut off */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-14 md:-mt-18">
          <div className="mx-auto md:mx-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full ring-4 ring-white shadow-xl bg-white">
              <img 
                src={userImage} 
                alt={user.username} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex flex-1 justify-end gap-3 pb-2">
            {isOwnProfile ? (
              <>
                <Link 
                  to="/settings"
                  className="btn-secondary"
                >
                  Edit Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Settings size={20} className="text-gray-700" />
                </Link>
              </>
            ) : (
              <>
                <FollowButton 
                  userId={parseInt(userId)} 
                  initialFollowed={isFollowing}
                  onFollowChange={handleFollowChange}
                />
                <Link 
                  to="/messages"
                  className="btn-secondary"
                >
                  <MessageCircle size={18} />
                  Message
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          {user.email && (
            <p className="text-gray-500 text-sm mt-0.5">@{user.email.split('@')[0]}</p>
          )}
          {user.bio && (
            <p className="text-gray-700 mt-3 max-w-lg whitespace-pre-line">{user.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center md:justify-start gap-6 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.posts.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="w-px bg-gray-200" />
          <button className="text-center hover:opacity-70 transition-opacity">
            <p className="text-2xl font-bold text-gray-900">{stats.followers.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </button>
          <div className="w-px bg-gray-200" />
          <button className="text-center hover:opacity-70 transition-opacity">
            <p className="text-2xl font-bold text-gray-900">{stats.following.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Following</p>
          </button>
        </div>

        {/* Actions - Mobile */}
        <div className="flex md:hidden gap-3 mt-6">
          {isOwnProfile ? (
            <>
              <Link 
                to="/settings"
                className="flex-1 btn-secondary justify-center"
              >
                Edit Profile
              </Link>
              <Link 
                to="/settings" 
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Settings size={20} className="text-gray-700" />
              </Link>
            </>
          ) : (
            <>
              <div className="flex-1">
                <FollowButton 
                  userId={parseInt(userId)} 
                  initialFollowed={isFollowing}
                  onFollowChange={handleFollowChange}
                  fullWidth
                />
              </div>
              <Link 
                to="/messages"
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <MessageCircle size={20} className="text-gray-700" />
              </Link>
            </>
          )}
        </div>

        {/* Story highlight - single "New" placeholder (stories can be added later) */}
        {isOwnProfile && (
          <div className="flex gap-4 mt-6 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer">
                <span className="text-2xl font-light">+</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">New</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
