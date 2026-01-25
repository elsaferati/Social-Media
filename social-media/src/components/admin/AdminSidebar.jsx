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
    <aside className="w-[260px] bg-white border-r border-[#E2E8F0] min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] gradient-bg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1E293B] tracking-tight">Admin Panel</h1>
            <p className="text-xs text-[#64748B]">Socialix Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-[#F3E8FF] text-[#7E22CE] font-semibold'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#7E22CE] rounded-r-full" />
                    )}
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#E2E8F0] space-y-1">
        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-[12px] mb-2">
          <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center">
            <span className="text-[#7E22CE] font-semibold text-sm">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1E293B] truncate">
              {currentUser?.username}
            </p>
            <p className="text-xs text-[#64748B]">Administrator</p>
          </div>
        </div>

        {/* Back to App */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to App</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[#EF4444] hover:bg-[#FEE2E2] transition-all text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
