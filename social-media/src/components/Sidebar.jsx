import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import auth context

const Sidebar = () => {
  const { currentUser } = useAuth(); // Get the logged-in user

  const links = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Bookmarks", path: "/bookmarks" },
    // Use the real User ID here!
    { name: "Profile", path: `/profile/${currentUser?.id}` }, 
    { name: "Settings", path: "/settings" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <aside className="bg-gray-100 p-4 md:w-64 w-full md:flex-shrink-0 h-full">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name} // Changed key to name to be unique
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