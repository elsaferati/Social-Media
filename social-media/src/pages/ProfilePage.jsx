import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ProfileHeader from "../components/ProfileHeader";
import CommentsModal from "../components/CommentsModal";
import LikesModal from "../components/LikesModal";
import { Grid, Bookmark, Heart, MessageCircle, Camera, Play } from "lucide-react";
import { userAPI, postAPI, UPLOADS_ORIGIN } from "../services/api";

const getPostImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  return `${UPLOADS_ORIGIN}${img.startsWith('/') ? '' : '/'}${img}`;
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [likesPostId, setLikesPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userData, postsData] = await Promise.all([
          userAPI.getUser(userId),
          postAPI.getByUser(userId),
        ]);
        setUser(userData);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error(err);
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
            posts.map((post, index) => {
              const likeCount = post.likeCount ?? post.likecount ?? post.likes ?? 0;
              const commentCount = post.commentCount ?? post.commentcount ?? 0;
              return (
              <div 
                key={post.id} 
                className="aspect-square bg-gray-100 relative group overflow-hidden rounded-lg animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Content area - click opens comments */}
                <button
                  type="button"
                  onClick={() => setCommentsPostId(post.id)}
                  className="absolute inset-0 w-full h-full cursor-pointer text-left"
                >
                  {post.img ? (
                    <img 
                      src={getPostImageUrl(post.img)} 
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
                </button>
                
                {/* Bar: likes opens LikesModal, comments opens CommentsModal */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 flex items-center justify-center gap-4 text-white text-sm font-medium">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLikesPostId(post.id); }}
                    className="flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Heart size={16} fill="currentColor" />
                    {likeCount}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCommentsPostId(post.id); }}
                    className="flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <MessageCircle size={16} fill="currentColor" />
                    {commentCount}
                  </button>
                </div>
                {/* Hover overlay - same click targets */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-semibold pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Heart size={22} fill="white" />
                    <span>{likeCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={22} fill="white" />
                    <span>{commentCount}</span>
                  </div>
                </div>

                {/* Video/Carousel Indicator */}
                {post.isVideo && (
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <Play size={20} fill="white" className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
            );
            })
          ) : null}
          {posts.length === 0 && (
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
                  : "This user hasn't posted anything yet."}
              </p>
            </div>
          )}
        </div>

        {commentsPostId && (
          <CommentsModal
            isOpen={!!commentsPostId}
            onClose={() => setCommentsPostId(null)}
            postId={commentsPostId}
            postAuthor={posts.find((p) => p.id === commentsPostId)?.username || 'User'}
          />
        )}
        {likesPostId && (
          <LikesModal
            isOpen={!!likesPostId}
            onClose={() => setLikesPostId(null)}
            postId={likesPostId}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
