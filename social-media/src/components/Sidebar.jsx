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
      <div className="px-6 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] gradient-bg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-[#1E293B] tracking-tight">Socialix</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 group
                ${isActive 
                  ? "bg-[#F3E8FF] text-[#7E22CE] font-semibold" 
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#7E22CE] rounded-r-full" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  <span className="text-[15px]">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1 border-t border-[#E2E8F0] pt-4">
        {/* Admin Panel */}
        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200
              ${isActive 
                ? "bg-[#F3E8FF] text-[#7E22CE] font-semibold" 
                : "text-[#7E22CE] hover:bg-[#F3E8FF]/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#7E22CE] rounded-r-full" />
                )}
                <Shield size={22} />
                <span className="text-[15px]">Admin Panel</span>
              </>
            )}
          </NavLink>
        )}
        
        {/* Settings */}
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200
            ${isActive 
              ? "bg-[#F1F5F9] text-[#1E293B] font-semibold" 
              : "text-[#475569] hover:bg-[#F1F5F9]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#475569] rounded-r-full" />
              )}
              <Settings size={22} />
              <span className="text-[15px]">Settings</span>
            </>
          )}
        </NavLink>
        
        {/* Logout */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] hover:bg-[#FEE2E2] rounded-[12px] transition-all duration-200"
        >
          <LogOut size={22} />
          <span className="text-[15px] font-medium">Logout</span>
        </button>

        {/* User Profile Card */}
        <div className="mt-3 p-4 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} 
              alt={currentUser?.username}
              className="w-10 h-10 rounded-full object-cover bg-[#E2E8F0]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1E293B] truncate">{currentUser?.username}</p>
              <p className="text-xs text-[#64748B] truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
