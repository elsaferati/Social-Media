import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/notifications?userId=${currentUser.id}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();
  }, [currentUser.id]);

  return (
    <div className="notifications-page p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="bg-white rounded shadow border divide-y">
        {notifications.length === 0 ? (
           <div className="p-4 text-gray-500 text-center">No notifications yet.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition">
              {/* Avatar */}
              <Link to={`/profile/${n.senderUserId}`}>
                 <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {n.username[0].toUpperCase()}
                 </div>
              </Link>

              {/* Message */}
              <div className="flex-1">
                 <span className="font-bold text-gray-900">{n.username} </span>
                 <span className="text-gray-600">
                   {n.type === 'like' ? 'liked your post.' : 'started following you.'}
                 </span>
                 <div className="text-xs text-gray-400 mt-1">
                   {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;