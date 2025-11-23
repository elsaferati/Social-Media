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
        console.log(err);
      }
    };
    if (currentUser) {
      fetchSuggestions();
    }
  }, [currentUser]);

  const handleFollow = async (followedUserId) => {
    try {
      await fetch("http://localhost:8800/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerUserId: currentUser.id,
          followedUserId: followedUserId,
        }),
      });
      // Remove the user from the list after following
      setUsers(users.filter((u) => u.id !== followedUserId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="font-bold text-gray-500 mb-4">Suggested for you</h2>
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:underline">
              {/* Simple Avatar Placeholder */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span className="font-semibold text-sm">{user.username}</span>
            </Link>
            <button
              onClick={() => handleFollow(user.id)}
              className="text-blue-500 text-xs font-bold hover:text-blue-700"
            >
              Follow
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="text-gray-400 text-sm">No new users to follow.</p>}
      </div>
    </div>
  );
};

export default SuggestedUsers;