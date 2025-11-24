import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Heart, UserPlus } from "lucide-react";

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
    if(currentUser) fetchNotifications();
  }, [currentUser]);

  return (
    <Layout>
      <div className="w-full max-w-[600px] mx-auto bg-white md:bg-transparent rounded-lg md:p-0">
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-0 pt-4 md:pt-0">Notifications</h1>
        
        <div className="flex flex-col">
          {notifications.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-4">
                     <Heart size={32} className="text-gray-300" />
                 </div>
                 <p className="text-gray-500">Activity On Your Posts</p>
                 <p className="text-xs text-gray-400 mt-1">When someone likes or comments on your posts, you'll see it here.</p>
             </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Link to={`/profile/${n.senderUserId}`}>
                       <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
                           <img src={n.senderImg || "https://i.pravatar.cc/150?u=" + n.senderUserId} className="w-full h-full object-cover" alt="" />
                       </div>
                    </Link>

                    {/* Text */}
                    <div className="text-sm">
                       <span className="font-semibold text-black mr-1">{n.username}</span>
                       <span className="text-gray-800">
                         {n.type === 'like' ? 'liked your post.' : 'started following you.'}
                       </span>
                       <div className="text-xs text-gray-400 mt-0.5">
                         {new Date(n.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                </div>

                {/* Right Icon / Preview */}
                {n.type === 'like' ? (
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                        {/* If you had post image in notification data, show it here */}
                        <div className="w-full h-full bg-gray-300"></div> 
                    </div>
                ) : (
                    <button className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-600 transition">
                        Follow
                    </button>
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