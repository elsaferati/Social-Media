import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostsFeed from "../components/PostsFeed";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch User Info
        const userRes = await fetch(`http://localhost:8800/api/users/${userId}`);
        
        if (!userRes.ok) {
            throw new Error("User not found!");
        }

        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch User's Posts
        const postsRes = await fetch(`http://localhost:8800/api/posts/user/${userId}`);
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="profile-page flex flex-col gap-4 p-4">
      {/* Header Section */}
      <div className="bg-white p-6 rounded shadow border">
        <div className="flex items-center gap-4">
           {/* Placeholder Avatar */}
           <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user.username[0].toUpperCase()}
           </div>
           <div>
             <h1 className="text-3xl font-bold">{user.username}</h1>
             <p className="text-gray-500">{user.email}</p>
             <p className="text-xs text-gray-400 mt-1">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
           </div>
        </div>
        
        <div className="mt-6 flex gap-6 border-t pt-4">
          <div className="text-center">
             <div className="font-bold text-xl">{posts.length}</div>
             <div className="text-gray-600 text-sm">Posts</div>
          </div>
          <div className="text-center">
             <div className="font-bold text-xl">0</div>
             <div className="text-gray-600 text-sm">Followers</div>
          </div>
          <div className="text-center">
             <div className="font-bold text-xl">0</div>
             <div className="text-gray-600 text-sm">Following</div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">User Posts</h2>
        {posts.length > 0 ? (
           <PostsFeed posts={posts} />
        ) : (
           <p className="text-gray-500">This user hasn't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;