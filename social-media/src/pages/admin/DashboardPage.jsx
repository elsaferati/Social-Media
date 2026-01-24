import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageCircle, MessageSquare, Heart } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import { adminAPI } from '../../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    messages: 0,
    likes: 0,
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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Error loading statistics: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your social media platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Posts"
          value={stats.posts}
          icon={FileText}
          color="green"
        />
        <StatsCard
          title="Comments"
          value={stats.comments}
          icon={MessageCircle}
          color="purple"
        />
        <StatsCard
          title="Messages"
          value={stats.messages}
          icon={MessageSquare}
          color="orange"
        />
        <StatsCard
          title="Likes"
          value={stats.likes}
          icon={Heart}
          color="pink"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Manage Users</span>
          </a>
          <a
            href="/admin/posts"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Manage Posts</span>
          </a>
          <a
            href="/admin/comments"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700">Manage Comments</span>
          </a>
          <a
            href="/admin/messages"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700">View Messages</span>
          </a>
        </div>
      </div>

      {/* Platform Info */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Welcome to Admin Panel</h2>
        <p className="text-blue-100">
          Manage your social media platform efficiently. Monitor user activity, 
          moderate content, and keep your community safe.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
