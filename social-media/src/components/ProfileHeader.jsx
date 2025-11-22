import React from "react";

function ProfileHeader() {
  return (
    <div
      className="card"
      data-name="profile-header"
      data-file="components/ProfileHeader.js"
    >
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-xl"></div>

      <div className="px-6 pb-6">
        {/* Profile Picture + Edit Button */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          <button className="btn-primary">Edit Profile</button>
        </div>

        {/* Profile Info */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Sarah Johnson
          </h1>
          <p className="text-[var(--text-secondary)]">@sarahj</p>

          <p className="mt-3 text-[var(--text-primary)]">
            Designer & Developer | Creating beautiful experiences | Coffee
            enthusiast ☕
          </p>

          {/* Location + Join Date */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="icon-map-pin text-base text-[var(--text-secondary)]"></div>
              <span className="text-[var(--text-secondary)]">
                San Francisco, CA
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="icon-calendar text-base text-[var(--text-secondary)]"></div>
              <span className="text-[var(--text-secondary)]">
                Joined March 2024
              </span>
            </div>
          </div>

          {/* Following / Followers */}
          <div className="flex items-center gap-6 mt-4">
            <div>
              <span className="font-bold text-[var(--text-primary)]">256</span>
              <span className="text-[var(--text-secondary)] ml-1">
                Following
              </span>
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)]">1.2K</span>
              <span className="text-[var(--text-secondary)] ml-1">
                Followers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
