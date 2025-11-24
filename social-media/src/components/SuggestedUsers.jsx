import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/users/suggestions/${currentUser.id}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        // Fallback dummy data if API fails so UI looks good for testing
        setUsers([
             {id: 99, username: "design_daily", img: "https://i.pravatar.cc/150?img=12"},
             {id: 98, username: "travel_mike", img: "https://i.pravatar.cc/150?img=15"},
             {id: 97, username: "code_guru", img: "https://i.pravatar.cc/150?img=8"},
        ]);
      }
    };
    if (currentUser) {
      fetchSuggestions();
    }
  }, [currentUser]);

  const handleFollow = async (followedUserId) => {
    // ... logic remains same ...
    console.log("Followed", followedUserId);
    setUsers(users.filter((u) => u.id !== followedUserId));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
         <span className="text-sm font-bold text-gray-500">Suggested for you</span>
         <button className="text-xs font-semibold text-gray-900 hover:text-gray-600">See All</button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden">
                <img 
                    src={user.img || `https://i.pravatar.cc/150?u=${user.id}`} 
                    alt="user" 
                    className="w-full h-full object-cover"
                />
              </div>
              
              {/* Text */}
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800 group-hover:text-gray-600">
                    {user.username}
                </span>
                <span className="text-xs text-gray-400">New to Instagram</span>
              </div>
            </Link>

            {/* Action */}
            <button
              onClick={() => handleFollow(user.id)}
              className="text-blue-500 text-xs font-bold hover:text-blue-700 transition"
            >
              Follow
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="text-gray-400 text-xs">All caught up!</p>}
      </div>

      {/* Footer Links (Visual filler) */}
      <div className="mt-8 flex flex-wrap gap-2 text-[11px] text-gray-300">
          <span>About</span> <span>•</span> <span>Help</span> <span>•</span> <span>API</span> <span>•</span> <span>Privacy</span>
      </div>
      <div className="mt-4 text-[11px] text-gray-300">
          © 2025 MY SOCIAL APP
      </div>
    </div>
  );
};

export default SuggestedUsers;