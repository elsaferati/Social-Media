import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Search, Compass, Heart, Bookmark, User, PlusSquare, MessageCircle, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const userId = currentUser?.id;

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={24} /> },
    { name: "Search", path: "/search", icon: <Search size={24} /> },
    { name: "Explore", path: "/explore", icon: <Compass size={24} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={24} /> },
    { name: "Notifications", path: "/notifications", icon: <Heart size={24} /> },
    { name: "Create", path: "#", icon: <PlusSquare size={24} />, action: "create" }, // We will handle this in parent
    { name: "Profile", path: `/profile/${userId}`, icon: <User size={24} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-16 md:w-64 border-r border-gray-200 bg-white z-50 flex flex-col justify-between pb-4 transition-all">
      {/* Logo Area */}
      <div>
        <div className="h-16 flex items-center px-4 md:px-6 mb-4">
          {/* Mobile Logo (Icon) */}
          <span className="md:hidden text-2xl font-bold text-pink-600">M</span> 
          {/* Desktop Logo (Text) */}
          <h1 className="hidden md:block text-xl font-bold font-[cursive] text-gray-900">My Social App</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive ? "font-bold text-black" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="group-hover:scale-105 transition-transform">{item.icon}</span>
              <span className="hidden md:block text-base">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="px-2 space-y-2">
         <NavLink to="/settings" className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Settings size={24} />
            <span className="hidden md:block">Settings</span>
         </NavLink>
         <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-left">
            <LogOut size={24} />
            <span className="hidden md:block">Logout</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;