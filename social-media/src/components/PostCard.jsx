import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const { currentUser } = useAuth();
  
  // Likes State
  const [likes, setLikes] = useState([]); 
  const isLiked = likes.includes(currentUser.id);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 1. Fetch Likes AND Bookmark Status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Likes
        const likeRes = await fetch(`http://localhost:8800/api/likes?postId=${post.id}`);
        const likeData = await likeRes.json();
        setLikes(likeData);

        // Fetch Bookmark Status
        const bookRes = await fetch(`http://localhost:8800/api/bookmarks/check?userId=${currentUser.id}&postId=${post.id}`);
        const bookData = await bookRes.json();
        setIsBookmarked(bookData); // true or false

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [post.id, currentUser.id]);

  // 2. Handle Like Click
  const handleLike = async () => {
    // ... (Keep your existing like logic here)
    // For brevity, pasting just the fetch part:
    if (isLiked) setLikes(likes.filter(id => id !== currentUser.id));
    else setLikes([...likes, currentUser.id]);
    
    await fetch("http://localhost:8800/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId: post.id }),
    });
  };

  // 3. Handle Bookmark Click
  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked); // Optimistic update
    
    try {
      await fetch("http://localhost:8800/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId: post.id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 border relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`} className="font-bold hover:underline">
            {post.username}
            </Link>
            <div className="text-gray-500 text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
            </div>
        </div>
        {/* Bookmark Button */}
        <button onClick={handleBookmark} className="text-xl">
            {isBookmarked ? "🔖" : "🏷️"} 
        </button>
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