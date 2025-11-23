import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/explore" className="hover:text-blue-500">Explore</Link>
        <Link to="/notifications" className="hover:text-blue-500">Notifications</Link>
        <Link to="/bookmarks" className="hover:text-blue-500">Bookmarks</Link>
        <Link to="/profile/1" className="hover:text-blue-500">Profile</Link>
        <Link to="/settings" className="hover:text-blue-500">Settings</Link>
        <Link to="/messages" className="hover:text-blue-500">Messages</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
