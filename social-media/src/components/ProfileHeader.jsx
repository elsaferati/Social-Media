import React from "react";
import FollowButton from "./FollowButton";

const ProfileHeader = ({ userId }) => {
  const user = { name: "John Doe", bio: "Web Developer", isFollowed: false };

  return (
    <div className="profile-header p-4 border-b mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.bio}</p>
      </div>
      <FollowButton initialFollowed={user.isFollowed} />
    </div>
  );
};

export default ProfileHeader;
