import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To read the URL
import PostsFeed from "../components/PostsFeed";
import ProfileHeader from "../components/ProfileHeader"; // Ensure you have this component or create a simple one

const ProfilePage = () => {
  const { userId } = useParams(); // Get ID from URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch User Info
        const userRes = await fetch(`http://localhost:8800/api/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch User's Posts
        const postsRes = await fetch(`http://localhost:8800/api/posts/user/${userId}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userId]); // Re-run if URL changes

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="profile-page flex flex-col gap-4">
      {/* Header Section */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
        <p className="text-gray-500">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        <div className="mt-4 flex gap-4">
          <div className="font-bold">{posts.length} <span className="font-normal text-gray-600">Posts</span></div>
          <div className="font-bold">0 <span className="font-normal text-gray-600">Followers</span></div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <PostsFeed posts={posts} />
      </div>
    </div>
  );
};

export default ProfilePage;