import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, MessageCircle, MessageSquare, Heart, CircleDot, Flag, Hash, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, href }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'text-pink-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'text-gray-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'text-cyan-500' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link 
      to={href || '#'}
      className="stat-card group flex flex-col hover:border-[#D1D5DB]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`stat-icon ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <ArrowUpRight 
          size={16} 
          className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" 
        />
      </div>
      <p className="stat-value">{value.toLocaleString()}</p>
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
        <div className="w-10 h-10 border-3 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        Error loading statistics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Overview of your social media platform</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={stats.users} icon={Users} color="blue" href="/admin/users" />
        <StatCard title="Total Posts" value={stats.posts} icon={FileText} color="green" href="/admin/posts" />
        <StatCard title="Comments" value={stats.comments} icon={MessageCircle} color="purple" href="/admin/comments" />
        <StatCard title="Messages" value={stats.messages} icon={MessageSquare} color="orange" href="/admin/messages" />
        <StatCard title="Likes" value={stats.likes} icon={Heart} color="pink" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Stories" value={stats.stories} icon={CircleDot} color="cyan" href="/admin/stories" />
        <StatCard title="Pending Reports" value={stats.pendingReports} icon={Flag} color="red" href="/admin/reports" />
        <StatCard title="Hashtags" value={stats.hashtags} icon={Hash} color="indigo" href="/admin/hashtags" />
        <StatCard title="Activity Logs" value={stats.activityLogs} icon={Activity} color="gray" href="/admin/activity-logs" />
      </div>

      {/* Quick Actions & Welcome */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/users', icon: Users, label: 'Manage Users', color: 'text-blue-500' },
              { href: '/admin/posts', icon: FileText, label: 'Manage Posts', color: 'text-green-500' },
              { href: '/admin/reports', icon: Flag, label: 'Review Reports', color: 'text-red-500' },
              { href: '/admin/activity-logs', icon: Activity, label: 'View Activity', color: 'text-gray-500' },
            ].map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center group-hover:bg-white transition-colors">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="font-medium text-[#374151]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Welcome Card */}
        <div className="gradient-bg rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} />
            <span className="text-sm font-medium opacity-90">Platform Status</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Everything looks good!</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Your platform is running smoothly. Monitor activity, manage content, and keep your community safe.
          </p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-80">System Health</span>
              <span className="font-semibold">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
