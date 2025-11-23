import React from "react";
import PostsFeed from "../components/PostsFeed";

const BookmarksPage = () => {
  return (
    <div className="bookmarks-page">
      <h1 className="text-2xl font-bold mb-4">Bookmarked Posts</h1>
      <PostsFeed filter="bookmarks" />
    </div>
  );
};

export default BookmarksPage;
