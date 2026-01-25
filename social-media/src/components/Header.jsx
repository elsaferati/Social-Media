import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Heart, Send, Home, Search, Compass, MessageCircle, User, Settings, LogOut, X, PlusSquare, Shield } from "lucide-react";

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
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <Menu size={22} className="text-[#4B5563]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-[#1F2937]">Socialix</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavLink 
            to="/notifications"
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors relative"
          >
            <Heart size={22} className="text-[#4B5563]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </NavLink>
          <NavLink 
            to="/messages"
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors relative"
          >
            <Send size={20} className="text-[#4B5563]" />
          </NavLink>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative bg-white w-[280px] h-full flex flex-col animate-slideIn">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-bold text-lg text-[#1F2937]">Socialix</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <X size={22} className="text-[#6B7280]" />
              </button>
            </div>
            
            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${isActive 
                          ? "bg-[#EEF2FF] text-[#6366F1] font-semibold" 
                          : "text-[#4B5563] hover:bg-[#F3F4F6]"
                        }`
                      }
                    >
                      <Icon size={22} />
                      <span className="text-[15px]">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <NavLink
                    to="/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <Shield size={22} />
                    <span className="text-[15px] font-medium">Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-[#E5E7EB] space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl">
                <img 
                  src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`}
                  alt={currentUser?.username}
                  className="w-10 h-10 rounded-full object-cover bg-[#E5E7EB]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1F2937] truncate">{currentUser?.username || "Guest"}</p>
                  <p className="text-xs text-[#6B7280] truncate">{currentUser?.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <NavLink
                  to="/settings"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F3F4F6] text-[#4B5563] rounded-xl hover:bg-[#E5E7EB] transition-colors text-sm font-medium"
                >
                  <Settings size={18} />
                  Settings
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
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
