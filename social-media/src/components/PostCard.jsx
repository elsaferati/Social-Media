import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const userImage = post.userImg || "https://i.pravatar.cc/150?u=" + post.userId;
  const username = post.username || "user_" + post.userId;
  const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "just now";

  return (
    <article className="bg-white border-b md:border border-gray-200 md:rounded-lg mb-4 text-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
            <img src={userImage} alt="" className="w-full h-full rounded-full border border-white object-cover" />
          </div>
          <span className="font-semibold text-gray-900">{username}</span>
          <span className="text-gray-400 text-xs">• {timeAgo}</span>
        </div>
        <button className="text-gray-900">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="w-full bg-black flex items-center justify-center overflow-hidden max-h-[600px]">
        {post.img ? (
          <img src={post.img} alt="Post" className="w-full object-contain" />
        ) : (
          <div className="h-80 w-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">{post.content}</p>
          </div>
        )}
      </div>

      {/* Footer Content */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <button onClick={() => setLiked(!liked)} className="hover:opacity-60 transition">
              <Heart size={26} className={liked ? "fill-red-500 text-red-500" : "text-black"} strokeWidth={1.5} />
            </button>
            <button className="hover:opacity-60 transition"><MessageCircle size={26} strokeWidth={1.5} /></button>
            <button className="hover:opacity-60 transition"><Send size={26} strokeWidth={1.5} /></button>
          </div>
          <button className="hover:opacity-60 transition"><Bookmark size={26} strokeWidth={1.5} /></button>
        </div>

        <div className="font-semibold text-sm mb-2">
            {liked ? (post.likes || 0) + 1 : (post.likes || 0)} likes
        </div>

        <div className="mb-2">
          <span className="font-semibold mr-2">{username}</span>
          <span className="text-gray-900">{post.content || "No description."}</span>
        </div>

        <button className="text-gray-500 text-sm mb-2">View all 12 comments</button>
        
        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
            {timeAgo} AGO
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
            <Smile size={20} className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 outline-none text-sm placeholder-gray-400"
            />
            <button className="text-blue-500 font-semibold text-sm opacity-50 hover:opacity-100">Post</button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;