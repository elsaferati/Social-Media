import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Search, Compass, Heart, Bookmark, User, PlusSquare, MessageCircle, Settings, LogOut, Shield, Sparkles } from "lucide-react";

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
    { name: "Create", path: "#", icon: PlusSquare, action: "create" },
    { name: "Profile", path: `/profile/${userId}`, icon: User },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 z-50 flex flex-col justify-between py-6 transition-all duration-300">
      {/* Logo Area */}
      <div>
        <div className="px-4 lg:px-6 mb-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Socialix</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-200" 
                    : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={22} 
                      className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="hidden lg:block text-[15px] font-medium">{item.name}</span>
                    {!isActive && (
                      <span className="lg:hidden absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="px-3 space-y-1">
        {/* Admin Panel Link */}
        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? "bg-purple-500 text-white shadow-lg shadow-purple-200" 
                : "text-purple-600 hover:bg-purple-50"
              }`
            }
          >
            <Shield size={22} />
            <span className="hidden lg:block text-[15px] font-medium">Admin Panel</span>
          </NavLink>
        )}
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
            ${isActive 
              ? "bg-gray-100 text-gray-900" 
              : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <Settings size={22} />
          <span className="hidden lg:block text-[15px] font-medium">Settings</span>
        </NavLink>
        
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="hidden lg:block text-[15px] font-medium">Logout</span>
        </button>

        {/* User Card */}
        <div className="hidden lg:flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
          <div className="avatar-ring">
            <img 
              src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} 
              alt={currentUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.username}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
