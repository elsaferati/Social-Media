import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Heart, Send, Home, Search, Compass, MessageCircle, User, Settings, LogOut, Sparkles, Shield, X, PlusSquare } from "lucide-react";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Messages", path: "/messages", icon: MessageCircle },
    { name: "Notifications", path: "/notifications", icon: Heart },
    { name: "Create", path: "#", icon: PlusSquare },
    { name: "Profile", path: `/profile/${currentUser?.id}`, icon: User },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 h-16 flex justify-between items-center md:hidden">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Socialix</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <NavLink 
            to="/notifications"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
          >
            <Heart size={22} className="text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </NavLink>
          <NavLink 
            to="/messages"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
          >
            <Send size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 bg-indigo-500 text-[10px] text-white font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white px-1">
              2
            </span>
          </NavLink>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer */}
          <div className="relative bg-white w-[300px] h-full shadow-2xl flex flex-col animate-slideIn">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">Socialix</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-200" 
                          : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      <Icon size={22} />
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Admin Link */}
              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <NavLink
                    to="/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <Shield size={22} />
                    <span className="font-medium">Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 space-y-3">
              {/* User Card */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="avatar-ring">
                  <img 
                    src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`}
                    alt={currentUser?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{currentUser?.username || "Guest"}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <NavLink
                  to="/settings"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <Settings size={18} />
                  Settings
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
