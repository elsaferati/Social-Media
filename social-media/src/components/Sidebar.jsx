import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <--- 1. Import this

const Sidebar = () => {
  const { currentUser } = useAuth(); // <--- 2. Get the logged-in user

  // If for some reason user is not loaded yet, prevent crash
  const userId = currentUser ? currentUser.id : null;

  const links = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Bookmarks", path: "/bookmarks" },
    // 3. THIS IS THE FIX: Use dynamic ID instead of "1"
    { name: "Profile", path: `/profile/${userId}` }, 
    { name: "Settings", path: "/settings" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <aside className="bg-gray-100 p-4 md:w-64 w-full md:flex-shrink-0 h-full">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;