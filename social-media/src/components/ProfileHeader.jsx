import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { Settings, Grid, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI, relationshipAPI, postAPI } from "../services/api";

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
      
      // Fetch user data, relationship counts, and posts count in parallel
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

      // Check if current user follows this profile
      if (currentUser && !isOwnProfile) {
        try {
          const followData = await relationshipAPI.checkFollowing(currentUser.id, userId);
          setIsFollowing(followData.isFollowing);
        } catch (e) {
          // Might fail if endpoint doesn't exist, that's ok
        }
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
      <div className="flex flex-col w-full bg-white md:bg-transparent animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 px-4 py-6 md:px-0">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gray-200"></div>
          <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="flex gap-8">
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const userImage = user.profilePic || `https://i.pravatar.cc/150?u=${userId}`;

  return (
    <div className="flex flex-col w-full bg-white md:bg-transparent">
      
      {/* Top Section: Avatar & Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 px-4 py-6 md:px-0">
        
        {/* Avatar - Large */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600">
             <img 
               src={userImage} 
               alt={user.username} 
               className="w-full h-full rounded-full object-cover border-2 border-white"
             />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            
            {/* Row 1: Username & Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-xl md:text-2xl font-normal text-gray-800">{user.username}</h2>
                
                <div className="flex gap-2">
                    {isOwnProfile ? (
                        <>
                            <Link 
                              to="/settings"
                              className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition"
                            >
                                Edit profile
                            </Link>
                            <Link 
                              to="/bookmarks"
                              className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition"
                            >
                                View archive
                            </Link>
                            <Link to="/settings" className="p-1.5 text-gray-700 hover:text-black">
                              <Settings size={20} />
                            </Link>
                        </>
                    ) : (
                        <FollowButton 
                          userId={parseInt(userId)} 
                          initialFollowed={isFollowing}
                          onFollowChange={handleFollowChange}
                        />
                    )}
                </div>
            </div>

            {/* Row 2: Stats */}
            <div className="flex gap-8 text-base">
                <div className="flex md:gap-1 flex-col md:flex-row items-center">
                    <span className="font-bold text-black">{stats.posts}</span> 
                    <span className="text-gray-600">posts</span>
                </div>
                <button className="flex md:gap-1 flex-col md:flex-row items-center hover:opacity-70">
                    <span className="font-bold text-black">{stats.followers}</span> 
                    <span className="text-gray-600">followers</span>
                </button>
                <button className="flex md:gap-1 flex-col md:flex-row items-center hover:opacity-70">
                    <span className="font-bold text-black">{stats.following}</span> 
                    <span className="text-gray-600">following</span>
                </button>
            </div>

            {/* Row 3: Name & Bio */}
            <div className="text-center md:text-left text-sm">
                <div className="font-bold text-gray-900">{user.username}</div>
                {user.bio && (
                  <div className="whitespace-pre-line text-gray-700 mt-1">{user.bio}</div>
                )}
                {user.email && (
                  <div className="text-gray-400 text-xs mt-1">{user.email}</div>
                )}
            </div>
        </div>
      </div>

      {/* Profile Highlights (Optional Visual Flair) */}
      <div className="flex gap-6 overflow-x-auto px-4 pb-4 md:px-0 scrollbar-hide">
         {[1,2,3].map(i => (
             <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                 <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-2xl">+</div>
                 <span className="text-xs text-gray-500 font-medium">New</span>
             </div>
         ))}
      </div>

      {/* Tabs Divider */}
      <div className="border-t border-gray-200 flex justify-center gap-12 text-xs font-semibold tracking-wide text-gray-500 uppercase mt-4">
          <div className="flex items-center gap-2 py-3 border-t-2 border-black text-black cursor-pointer">
              <Grid size={12} /> Posts
          </div>
          {isOwnProfile && (
            <Link 
              to="/bookmarks"
              className="flex items-center gap-2 py-3 border-t-2 border-transparent hover:text-gray-700 cursor-pointer"
            >
                <Bookmark size={12} /> Saved
            </Link>
          )}
      </div>
    </div>
  );
};

export default ProfileHeader;
