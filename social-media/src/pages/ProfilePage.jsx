import React from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import PostsFeed from "../components/PostsFeed";

const ProfilePage = () => {
  const { userId } = useParams();

  return (
    <div className="profile-page">
      <ProfileHeader userId={userId} />
      <PostsFeed filter="user" userId={userId} />
    </div>
  );
};

export default ProfilePage;
