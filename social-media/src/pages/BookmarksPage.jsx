import React from "react";
import PostsFeed from "../components/PostsFeed";

const BookmarksPage = () => {
  const posts = [
    { id: 1, content: "Bookmarked post 1", likes: 2, isLiked: false, isBookmarked: true, userId: 2 },
    { id: 2, content: "Bookmarked post 2", likes: 4, isLiked: true, isBookmarked: true, userId: 3 },
  ];

  return (
    <div className="bookmarks-page p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      <PostsFeed posts={posts} filter="bookmarks" />
    </div>
  );
};

export default BookmarksPage;
