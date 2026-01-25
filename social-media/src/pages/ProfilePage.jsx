import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ProfileHeader from "../components/ProfileHeader";
import { Grid, Bookmark, Heart, MessageCircle, Camera, Play } from "lucide-react";

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await fetch(`http://localhost:8800/api/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const postsRes = await fetch(`http://localhost:8800/api/posts/user/${userId}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="w-full max-w-[935px] mx-auto">
          {/* Skeleton Header */}
          <div className="flex gap-8 md:gap-20 p-4 md:p-8">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full skeleton" />
            <div className="flex-1 space-y-4">
              <div className="h-6 skeleton rounded-lg w-48" />
              <div className="flex gap-8">
                <div className="h-4 skeleton rounded w-20" />
                <div className="h-4 skeleton rounded w-20" />
                <div className="h-4 skeleton rounded w-20" />
              </div>
              <div className="h-4 skeleton rounded w-64" />
            </div>
          </div>
          {/* Skeleton Grid */}
          <div className="grid grid-cols-3 gap-1 md:gap-2 mt-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square skeleton" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Camera size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-500">This user doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = currentUser?.id === parseInt(userId);

  const tabs = [
    { id: 'posts', icon: Grid, label: 'Posts' },
    ...(isOwnProfile ? [{ id: 'saved', icon: Bookmark, label: 'Saved' }] : []),
  ];

  return (
    <Layout>
      <div className="w-full max-w-[935px] mx-auto">
        {/* Profile Header */}
        <ProfileHeader userId={userId} userProp={user} postCount={posts.length} />

        {/* Tabs */}
        <div className="border-t border-gray-200 mt-4">
          <div className="flex justify-center gap-12">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-t-2 -mt-[1px] transition-colors ${
                    activeTab === tab.id 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 mt-4">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div 
                key={post.id} 
                className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden rounded-lg animate-fadeIn hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {post.img ? (
                  <img 
                    src={post.img.startsWith('http') ? post.img : `http://localhost:8800${post.img}`} 
                    className="w-full h-full object-cover" 
                    alt="post" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 p-4">
                    <p className="text-gray-600 text-sm text-center line-clamp-4">
                      {post.content}
                    </p>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <Heart size={22} fill="white" />
                    <span>{post.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={22} fill="white" />
                    <span>0</span>
                  </div>
                </div>

                {/* Video/Carousel Indicator */}
                {post.isVideo && (
                  <div className="absolute top-3 right-3">
                    <Play size={20} fill="white" className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center py-20">
              <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center mb-6">
                <Camera size={36} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isOwnProfile ? 'Share Photos' : 'No Posts Yet'}
              </h2>
              <p className="text-gray-500 text-center max-w-sm">
                {isOwnProfile 
                  ? 'When you share photos, they will appear on your profile.' 
                  : 'This user hasn\'t posted anything yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
