import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ProfileHeader from "../components/ProfileHeader"; // Assuming you saved the component I sent earlier
import PostsFeed from "../components/PostsFeed";
import { Grid, Camera } from "lucide-react";

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch User Info (In a real app, ProfileHeader might fetch this itself, but passing props is fine too)
        const userRes = await fetch(`http://localhost:8800/api/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Posts
        const postsRes = await fetch(`http://localhost:8800/api/posts/user/${userId}`);
        const postsData = await postsRes.json();
        setPosts(postsData);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <Layout><div className="w-full flex justify-center py-20">Loading...</div></Layout>;
  if (!user) return <Layout>User not found</Layout>;

  return (
    <Layout>
      <div className="w-full max-w-[935px] mx-auto flex flex-col">
        
        {/* The Header Component we built earlier */}
        <ProfileHeader userId={userId} userProp={user} postCount={posts.length} />

        {/* Post Grid (Instagram Style) */}
        {/* Usually Profile Grid is 3 columns of images, NOT a vertical feed. 
            I will create a grid view here. */}
        <div className="grid grid-cols-3 gap-1 md:gap-7 mt-4">
           {posts.length > 0 ? (
               posts.map(post => (
                   <div key={post.id} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
                       {post.img ? (
                           <img src={post.img} className="w-full h-full object-cover" alt="post" />
                       ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-gray-500 p-2 text-center">
                               {post.content.substring(0, 50)}...
                           </div>
                       )}
                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white font-bold gap-4">
                           <span>❤️ {post.likes || 0}</span>
                           <span>💬 0</span>
                       </div>
                   </div>
               ))
           ) : (
               <div className="col-span-3 flex flex-col items-center py-20 text-gray-500">
                   <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                       <Camera size={32} />
                   </div>
                   <h2 className="text-2xl font-light text-black">No Posts Yet</h2>
               </div>
           )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;