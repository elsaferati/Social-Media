import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Heart, UserPlus, MessageCircle, Bell } from "lucide-react";
import { notificationAPI } from "../services/api";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const data = await notificationAPI.getAll(currentUser.id);
      setNotifications(data);
      // Mark all as read when viewing
      await notificationAPI.markAllAsRead(currentUser.id);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500 fill-red-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-blue-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getNotificationText = (type) => {
    switch (type) {
      case 'like':
        return 'liked your post.';
      case 'follow':
        return 'started following you.';
      case 'comment':
        return 'commented on your post.';
      default:
        return 'interacted with your content.';
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[600px] mx-auto bg-white md:bg-transparent rounded-lg md:p-0">
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-0 pt-4 md:pt-0">Notifications</h1>
        
        <div className="flex flex-col bg-white rounded-lg border border-gray-200 md:border-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-4">
                     <Heart size={32} className="text-gray-300" />
                 </div>
                 <p className="text-gray-500">Activity On Your Posts</p>
                 <p className="text-xs text-gray-400 mt-1">When someone likes or comments on your posts, you'll see it here.</p>
             </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${!n.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Link to={`/profile/${n.senderUserId}`}>
                       <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 relative">
                           <img 
                             src={n.profilePic || "https://i.pravatar.cc/150?u=" + n.senderUserId} 
                             className="w-full h-full object-cover" 
                             alt="" 
                           />
                           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                             {getNotificationIcon(n.type)}
                           </div>
                       </div>
                    </Link>

                    {/* Text */}
                    <div className="text-sm">
                       <Link to={`/profile/${n.senderUserId}`} className="font-semibold text-black mr-1 hover:underline">
                         {n.username}
                       </Link>
                       <span className="text-gray-800">
                         {getNotificationText(n.type)}
                       </span>
                       <div className="text-xs text-gray-400 mt-0.5">
                         {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                       </div>
                    </div>
                </div>

                {/* Right Action */}
                {n.type === 'follow' ? (
                    <Link to={`/profile/${n.senderUserId}`}>
                      <button className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-600 transition">
                          View Profile
                      </button>
                    </Link>
                ) : n.postId && (
                    <Link to={`/`} className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        <Heart size={16} className="text-gray-400" />
                    </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
