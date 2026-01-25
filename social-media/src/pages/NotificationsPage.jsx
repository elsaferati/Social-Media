import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Heart, UserPlus, MessageCircle, Bell, CheckCheck } from "lucide-react";
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
        return <Heart size={16} className="text-white fill-white" />;
      case 'follow':
        return <UserPlus size={16} className="text-white" />;
      case 'comment':
        return <MessageCircle size={16} className="text-white" />;
      default:
        return <Bell size={16} className="text-white" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'like':
        return 'bg-gradient-to-br from-red-500 to-pink-500';
      case 'follow':
        return 'bg-gradient-to-br from-indigo-500 to-purple-500';
      case 'comment':
        return 'bg-gradient-to-br from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getNotificationText = (type) => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'follow':
        return 'started following you';
      case 'comment':
        return 'commented on your post';
      default:
        return 'interacted with your content';
    }
  };

  const todayNotifications = notifications.filter(n => {
    const date = new Date(n.createdAt);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  });

  const earlierNotifications = notifications.filter(n => {
    const date = new Date(n.createdAt);
    const today = new Date();
    return date.toDateString() !== today.toDateString();
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500">Stay updated with your activity</p>
          </div>
          {notifications.length > 0 && (
            <button className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
              <CheckCheck size={18} />
              Mark all read
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="card-flat p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="card-flat p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell size={36} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              When someone likes or comments on your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today */}
            {todayNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">Today</h2>
                <div className="card-flat overflow-hidden divide-y divide-gray-100">
                  {todayNotifications.map((n, index) => (
                    <div 
                      key={n.id} 
                      className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors animate-fadeIn ${!n.isRead ? 'bg-indigo-50/50' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Avatar */}
                      <Link to={`/profile/${n.senderUserId}`} className="relative flex-shrink-0">
                        <div className="avatar-ring">
                          <img 
                            src={n.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.senderUserId}`} 
                            className="w-12 h-12 rounded-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getNotificationBg(n.type)} rounded-full flex items-center justify-center shadow-lg`}>
                          {getNotificationIcon(n.type)}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <Link to={`/profile/${n.senderUserId}`} className="font-semibold hover:text-indigo-600">
                            {n.username}
                          </Link>
                          {' '}{getNotificationText(n.type)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                        </p>
                      </div>

                      {/* Action */}
                      {n.type === 'follow' ? (
                        <Link to={`/profile/${n.senderUserId}`}>
                          <button className="btn-primary text-xs py-2 px-4">
                            View Profile
                          </button>
                        </Link>
                      ) : n.postId && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Heart size={18} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earlier */}
            {earlierNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">Earlier</h2>
                <div className="card-flat overflow-hidden divide-y divide-gray-100">
                  {earlierNotifications.map((n, index) => (
                    <div 
                      key={n.id} 
                      className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors animate-fadeIn ${!n.isRead ? 'bg-indigo-50/50' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Avatar */}
                      <Link to={`/profile/${n.senderUserId}`} className="relative flex-shrink-0">
                        <div className="avatar-ring">
                          <img 
                            src={n.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.senderUserId}`} 
                            className="w-12 h-12 rounded-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getNotificationBg(n.type)} rounded-full flex items-center justify-center shadow-lg`}>
                          {getNotificationIcon(n.type)}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <Link to={`/profile/${n.senderUserId}`} className="font-semibold hover:text-indigo-600">
                            {n.username}
                          </Link>
                          {' '}{getNotificationText(n.type)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                        </p>
                      </div>

                      {/* Action */}
                      {n.type === 'follow' ? (
                        <Link to={`/profile/${n.senderUserId}`}>
                          <button className="btn-secondary text-xs py-2 px-4">
                            View
                          </button>
                        </Link>
                      ) : n.postId && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Heart size={18} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
