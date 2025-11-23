import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Import Link to make name clickable

const PostCard = ({ post }) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState([]); // Stores userIds of people who liked
  
  // Check if current user liked this post
  const isLiked = likes.includes(currentUser.id);

  // Fetch likes when component loads
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/likes?postId=${post.id}`);
        const data = await res.json();
        setLikes(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLikes();
  }, [post.id]);

  const handleLike = async () => {
    try {
      // Optimistic update (update UI immediately)
      if (isLiked) {
        setLikes(likes.filter(id => id !== currentUser.id));
      } else {
        setLikes([...likes, currentUser.id]);
      }

      // Send request to backend
      await fetch("http://localhost:8800/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId: post.id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 border">
      <div className="flex items-center gap-3 mb-2">
        {/* Make the name clickable to go to profile */}
        <Link to={`/profile/${post.userId}`} className="font-bold hover:underline">
          {post.username}
        </Link>
        <div className="text-gray-500 text-xs">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <p className="text-gray-800 mb-4">{post.content}</p>
      
      <div className="flex items-center gap-2 pt-2 border-t">
        <button 
          onClick={handleLike}
          className={`px-3 py-1 rounded text-sm font-semibold ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {isLiked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <span className="text-gray-500 text-sm">{likes.length} Likes</span>
      </div>
    </div>
  );
};

export default PostCard;