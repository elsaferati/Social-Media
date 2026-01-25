import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Search, Compass, Heart, User, PlusSquare, MessageCircle, Settings, LogOut, Shield } from "lucide-react";

const Sidebar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id;

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
    { name: "Profile", path: `/profile/${userId}`, icon: User },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-[#1F2937]">Socialix</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-[#EEF2FF] text-[#6366F1] font-semibold" 
                  : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className="flex-shrink-0"
                  />
                  <span className="text-[15px]">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-6 space-y-1 border-t border-[#E5E7EB] pt-4">
        {/* Admin Panel */}
        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? "bg-purple-50 text-purple-600 font-semibold" 
                : "text-purple-600 hover:bg-purple-50"
              }`
            }
          >
            <Shield size={22} />
            <span className="text-[15px]">Admin Panel</span>
          </NavLink>
        )}
        
        {/* Settings */}
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive 
              ? "bg-[#F3F4F6] text-[#1F2937] font-semibold" 
              : "text-[#4B5563] hover:bg-[#F3F4F6]"
            }`
          }
        >
          <Settings size={22} />
          <span className="text-[15px]">Settings</span>
        </NavLink>
        
        {/* Logout */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={22} />
          <span className="text-[15px] font-medium">Logout</span>
        </button>

        {/* User Profile Card */}
        <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} 
              alt={currentUser?.username}
              className="w-10 h-10 rounded-full object-cover bg-[#E5E7EB]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F2937] truncate">{currentUser?.username}</p>
              <p className="text-xs text-[#6B7280] truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
