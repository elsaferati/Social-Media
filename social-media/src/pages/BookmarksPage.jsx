import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostsFeed from "../components/PostsFeed";

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/posts/bookmarks/${currentUser.id}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookmarks();
  }, [currentUser.id]);

  return (
    <div className="bookmarks-page p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">You haven't bookmarked any posts yet.</p>
      ) : (
        <PostsFeed posts={posts} />
      )}
    </div>
  );
};

export default BookmarksPage;