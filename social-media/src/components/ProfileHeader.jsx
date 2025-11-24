import React from "react";
import FollowButton from "./FollowButton";
import { Settings, Grid, Bookmark } from "lucide-react"; // Icons for tabs

const ProfileHeader = ({ userId }) => {
  // In a real app, you'd fetch this user data based on userId
  const user = { 
    username: "john_doe_dev",
    name: "John Doe", 
    bio: "Web Developer 👨‍💻 | React & Tailwind Enthusiast 🎨 \nBuilding cool things.", 
    img: "https://i.pravatar.cc/150?u=" + userId,
    postsCount: 42,
    followers: 853,
    following: 120,
    isFollowed: false, 
    isOwnProfile: true // Toggle this to test "Edit Profile" vs "Follow"
  };

  return (
    <div className="flex flex-col w-full bg-white md:bg-transparent">
      
      {/* Top Section: Avatar & Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 px-4 py-6 md:px-0">
        
        {/* Avatar - Large */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full p-[2px] bg-gray-200">
             <img 
               src={user.img} 
               alt="" 
               className="w-full h-full rounded-full object-cover border-2 border-white"
             />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            
            {/* Row 1: Username & Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-xl md:text-2xl font-normal text-gray-800">{user.username}</h2>
                
                <div className="flex gap-2">
                    {user.isOwnProfile ? (
                        <>
                            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition">
                                Edit profile
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition">
                                View archive
                            </button>
                            <button className="p-1.5 text-gray-700 hover:text-black"><Settings size={20} /></button>
                        </>
                    ) : (
                        <FollowButton initialFollowed={user.isFollowed} />
                    )}
                </div>
            </div>

            {/* Row 2: Stats (Hidden on mobile usually, but we'll keep for now) */}
            <div className="flex gap-8 text-base">
                <div className="flex md:gap-1 flex-col md:flex-row items-center">
                    <span className="font-bold text-black">{user.postsCount}</span> 
                    <span className="text-gray-600">posts</span>
                </div>
                <div className="flex md:gap-1 flex-col md:flex-row items-center">
                    <span className="font-bold text-black">{user.followers}</span> 
                    <span className="text-gray-600">followers</span>
                </div>
                <div className="flex md:gap-1 flex-col md:flex-row items-center">
                    <span className="font-bold text-black">{user.following}</span> 
                    <span className="text-gray-600">following</span>
                </div>
            </div>

            {/* Row 3: Name & Bio */}
            <div className="text-center md:text-left text-sm">
                <div className="font-bold text-gray-900">{user.name}</div>
                <div className="whitespace-pre-line text-gray-700 mt-1">{user.bio}</div>
            </div>
        </div>
      </div>

      {/* Profile Highlights (Optional Visual Flair) */}
      <div className="flex gap-6 overflow-x-auto px-4 pb-4 md:px-0 scrollbar-hide">
         {[1,2,3].map(i => (
             <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                 <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300"></div>
                 <span className="text-xs text-gray-800 font-medium">Highlight</span>
             </div>
         ))}
      </div>

      {/* Tabs Divider */}
      <div className="border-t border-gray-200 flex justify-center gap-12 text-xs font-semibold tracking-wide text-gray-500 uppercase mt-4">
          <div className="flex items-center gap-2 py-3 border-t-2 border-black text-black cursor-pointer">
              <Grid size={12} /> Posts
          </div>
          <div className="flex items-center gap-2 py-3 border-t-2 border-transparent hover:text-gray-700 cursor-pointer">
              <Bookmark size={12} /> Saved
          </div>
      </div>
    </div>
  );
};

export default ProfileHeader;