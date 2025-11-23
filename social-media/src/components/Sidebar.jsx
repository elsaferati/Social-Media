import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Profile", path: "/profile/1" },
    { name: "Settings", path: "/settings" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <aside className="bg-gray-100 p-4 md:w-64 w-full md:flex-shrink-0">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
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
