import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);

  // Safe checks for data
  const userImage = post.userImg || "https://i.pravatar.cc/150?u=" + post.userId;
  const username = post.username || "user_" + post.userId;
  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "just now";

  return (
    <article className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
            <img src={userImage} alt="" className="w-full h-full rounded-full border-2 border-white object-cover" />
          </div>
          <span className="font-semibold text-sm">{username}</span>
          <span className="text-gray-400 text-xs">• {timeAgo}</span>
        </div>
        <button className="text-gray-500 hover:text-black">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image / Content */}
      <div className="w-full bg-gray-100 overflow-hidden">
        {/* If you have an image URL in your post object, use it. Otherwise show text nicely */}
        {post.img ? (
          <img src={post.img} alt="Post" className="w-full h-auto object-cover max-h-[600px]" />
        ) : (
          <div className="p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[200px]">
            <p className="text-xl text-center font-medium text-gray-800">{post.content}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <button onClick={() => setLiked(!liked)} className="hover:opacity-60 transition">
              <Heart size={24} className={liked ? "fill-red-500 text-red-500" : "text-black"} />
            </button>
            <button className="hover:opacity-60 transition"><MessageCircle size={24} /></button>
            <button className="hover:opacity-60 transition"><Send size={24} /></button>
          </div>
          <button className="hover:opacity-60 transition"><Bookmark size={24} /></button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-1">
            {liked ? (post.likes || 0) + 1 : (post.likes || 0)} likes
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {post.img && <span>{post.content}</span>}
        </div>

        {/* Comments Link */}
        <button className="text-gray-500 text-sm mt-2">View all 12 comments</button>
      </div>
    </article>
  );
};

export default PostCard;