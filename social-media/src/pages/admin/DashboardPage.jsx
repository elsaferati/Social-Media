import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, MessageCircle, MessageSquare, Heart, CircleDot, Flag, Hash, Activity, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, href }) => {
  const colorMap = {
    blue: { bg: 'bg-[#DBEAFE]', icon: 'text-[#3B82F6]' },
    green: { bg: 'bg-[#D1FAE5]', icon: 'text-[#10B981]' },
    purple: { bg: 'bg-[#F3E8FF]', icon: 'text-[#7E22CE]' },
    orange: { bg: 'bg-[#FEF3C7]', icon: 'text-[#F59E0B]' },
    pink: { bg: 'bg-[#FCE7F3]', icon: 'text-[#EC4899]' },
    red: { bg: 'bg-[#FEE2E2]', icon: 'text-[#EF4444]' },
    indigo: { bg: 'bg-[#E0E7FF]', icon: 'text-[#6366F1]' },
    gray: { bg: 'bg-[#F1F5F9]', icon: 'text-[#64748B]' },
    cyan: { bg: 'bg-[#CFFAFE]', icon: 'text-[#06B6D4]' },
  };

  const colors = colorMap[color] || colorMap.purple;

  return (
    <Link to={href || '#'} className="stat-card group block">
      <div className="flex items-start justify-between">
        <div className={`stat-icon ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <ArrowUpRight 
          size={18} 
          className="text-[#CBD5E1] opacity-0 group-hover:opacity-100 transition-opacity" 
        />
      </div>
      <p className="stat-value mt-4">{value.toLocaleString()}</p>
      <p className="stat-label">{title}</p>
    </Link>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    messages: 0,
    likes: 0,
    stories: 0,
    pendingReports: 0,
    hashtags: 0,
    activityLogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-[#7E22CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] p-4 rounded-[12px]">
        Error loading statistics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Dashboard</h1>
        <p className="text-[#64748B] mt-1">Overview of your social media platform</p>
      </div>

      {/* Primary Stats - 5 Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={stats.users} icon={Users} color="blue" href="/admin/users" />
        <StatCard title="Total Posts" value={stats.posts} icon={FileText} color="green" href="/admin/posts" />
        <StatCard title="Comments" value={stats.comments} icon={MessageCircle} color="purple" href="/admin/comments" />
        <StatCard title="Messages" value={stats.messages} icon={MessageSquare} color="orange" href="/admin/messages" />
        <StatCard title="Likes" value={stats.likes} icon={Heart} color="pink" />
      </div>

      {/* Secondary Stats - 4 Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Stories" value={stats.stories} icon={CircleDot} color="cyan" href="/admin/stories" />
        <StatCard title="Pending Reports" value={stats.pendingReports} icon={Flag} color="red" href="/admin/reports" />
        <StatCard title="Hashtags" value={stats.hashtags} icon={Hash} color="indigo" href="/admin/hashtags" />
        <StatCard title="Activity Logs" value={stats.activityLogs} icon={Activity} color="gray" href="/admin/activity-logs" />
      </div>

      {/* Quick Actions & Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-[#1E293B] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { href: '/admin/users', icon: Users, label: 'Manage Users', color: 'bg-[#DBEAFE]', iconColor: 'text-[#3B82F6]' },
              { href: '/admin/posts', icon: FileText, label: 'Manage Posts', color: 'bg-[#D1FAE5]', iconColor: 'text-[#10B981]' },
              { href: '/admin/reports', icon: Flag, label: 'Review Reports', color: 'bg-[#FEE2E2]', iconColor: 'text-[#EF4444]' },
              { href: '/admin/activity-logs', icon: Activity, label: 'View Activity', color: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
            ].map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] hover:shadow-sm transition-all group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <span className="font-medium text-[#475569] group-hover:text-[#1E293B]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Status Card */}
        <div className="gradient-bg rounded-[16px] p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-white" />
              <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Platform Status</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Everything looks good!</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Your platform is running smoothly. Monitor activity, manage content, and keep your community safe.
            </p>
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">System Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse"></div>
                  <span className="font-bold text-white">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
