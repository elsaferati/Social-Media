import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../services/api";
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
      <header className="bg-white border-b border-[#E2E8F0] px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 hover:bg-[#F1F5F9] rounded-[10px] transition-colors"
          >
            <Menu size={22} className="text-[#475569]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-[#1E293B]">Socialix</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavLink 
            to="/notifications"
            className="p-2 hover:bg-[#F1F5F9] rounded-[10px] transition-colors relative"
          >
            <Heart size={22} className="text-[#475569]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
          </NavLink>
          <NavLink 
            to="/messages"
            className="p-2 hover:bg-[#F1F5F9] rounded-[10px] transition-colors"
          >
            <Send size={20} className="text-[#475569]" />
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
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="font-bold text-lg text-[#1E293B]">Socialix</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-2 hover:bg-[#F1F5F9] rounded-[10px] transition-colors"
              >
                <X size={22} className="text-[#64748B]" />
              </button>
            </div>
            
            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all
                        ${isActive 
                          ? "bg-[#F3E8FF] text-[#7E22CE] font-semibold" 
                          : "text-[#475569] hover:bg-[#F1F5F9]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#7E22CE] rounded-r-full" />
                          )}
                          <Icon size={22} />
                          <span className="text-[15px]">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <NavLink
                    to="/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className="relative flex items-center gap-3 px-4 py-3 text-[#7E22CE] hover:bg-[#F3E8FF] rounded-[12px] transition-colors"
                  >
                    <Shield size={22} />
                    <span className="text-[15px] font-medium">Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-[12px]">
                <img 
                  src={getAvatarUrl(currentUser?.profilePic)}
                  alt={currentUser?.username}
                  className="w-10 h-10 rounded-full object-cover bg-[#E2E8F0]"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1E293B] truncate">{currentUser?.username || "Guest"}</p>
                  <p className="text-xs text-[#64748B] truncate">{currentUser?.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <NavLink
                  to="/settings"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F1F5F9] text-[#475569] rounded-[12px] hover:bg-[#E2E8F0] transition-colors text-sm font-medium"
                >
                  <Settings size={18} />
                  Settings
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FEE2E2] text-[#EF4444] rounded-[12px] hover:bg-[#FECACA] transition-colors text-sm font-medium"
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
