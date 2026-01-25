import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageCircle, 
  MessageSquare,
  ArrowLeft,
  LogOut,
  CircleDot,
  Flag,
  Hash,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/posts', icon: FileText, label: 'Posts' },
    { path: '/admin/comments', icon: MessageCircle, label: 'Comments' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/stories', icon: CircleDot, label: 'Stories' },
    { path: '/admin/reports', icon: Flag, label: 'Reports' },
    { path: '/admin/hashtags', icon: Hash, label: 'Hashtags' },
    { path: '/admin/activity-logs', icon: Activity, label: 'Activity Logs' },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-[#E5E7EB] min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1F2937]">Admin Panel</h1>
            <p className="text-xs text-[#6B7280]">Socialix Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-4 mb-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#6366F1] font-semibold'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-[#F9FAFB] rounded-xl">
          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center">
            <span className="text-[#6366F1] font-semibold text-sm">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1F2937] truncate">
              {currentUser?.username}
            </p>
            <p className="text-xs text-[#6B7280]">Administrator</p>
          </div>
        </div>

        {/* Back to App */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937] transition-all text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to App</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
