import React from "react";
import PostCard from "./PostCard";
import { Camera } from "lucide-react";

const PostsFeed = ({ posts, filter, userId, onDelete, onBookmarkRemoved }) => {
  // Apply filter if needed
  const displayedPosts = posts?.filter(post => {
    if (filter === "user" && userId) return post.userId === parseInt(userId);
    return true;
  }) || [];

  const handleDelete = (postId) => {
    if (onDelete) onDelete(postId);
  };

  const handleBookmarkChange = (postId, isBookmarked) => {
    // If in bookmarks view and post is unbookmarked, remove it from list
    if (filter === "bookmarks" && !isBookmarked && onBookmarkRemoved) {
      onBookmarkRemoved(postId);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {displayedPosts.length > 0 ? (
        displayedPosts.map(post => (
          <div key={post.id} className="w-full max-w-[470px]">
             <PostCard 
               post={post} 
               onDelete={handleDelete}
               onBookmarkChange={handleBookmarkChange}
             />
          </div>
        ))
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Camera size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-light">No Posts Yet</h3>
            <p className="text-sm text-gray-500 mt-2">When you post photos, they will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PostsFeed;
