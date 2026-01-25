import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, User, FileText, TrendingUp, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { searchAPI } from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const data = await searchAPI.all(searchQuery);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setResults({ users: [], posts: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      handleSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        setSearchParams({ q: query });
        handleSearch(query);
      }
    }
  };

  const filteredResults = () => {
    if (activeTab === 'users') return { users: results.users, posts: [] };
    if (activeTab === 'posts') return { users: [], posts: results.posts };
    return results;
  };

  const { users, posts } = filteredResults();

  const trendingTopics = [
    { tag: 'photography', posts: '12.5K' },
    { tag: 'travel', posts: '8.2K' },
    { tag: 'technology', posts: '15K' },
    { tag: 'fitness', posts: '6.8K' },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover</h1>
          <p className="text-gray-500">Find people, posts, and trending topics</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search users or posts..."
            className="w-full pl-14 pr-28 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 shadow-sm transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 gradient-bg text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all"
          >
            Search
          </button>
        </form>

        {/* Trending Topics (before search) */}
        {!hasSearched && (
          <div className="card-flat p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-gray-900">Trending Topics</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.tag}
                  onClick={() => { setQuery(topic.tag); handleSearch(topic.tag); }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 border-2 border-transparent transition-all group"
                >
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600">#{topic.tag}</p>
                    <p className="text-xs text-gray-500">{topic.posts} posts</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        {hasSearched && (results.users.length > 0 || results.posts.length > 0) && (
          <div className="flex gap-2 mb-6">
            {['all', 'users', 'posts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'gradient-bg text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="space-y-6">
            {/* Users */}
            {users.length > 0 && (
              <div className="card-flat p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  People ({users.length})
                </h2>
                <div className="space-y-3">
                  {users.map((user, index) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="avatar-ring">
                        <img 
                          src={user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                          alt={user.username} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
                        )}
                      </div>
                      <span className="text-indigo-600 font-medium text-sm">View</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Posts ({posts.length})
                </h2>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {hasSearched && !loading && users.length === 0 && posts.length === 0 && (
              <div className="card-flat p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">We couldn't find anything for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
