import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, User, FileText, TrendingUp, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { searchAPI, getAvatarUrl } from '../services/api';

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
      {/* Centered Content */}
      <div className="max-w-[680px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight mb-1">Discover</h1>
          <p className="text-[#64748B]">Find people, posts, and trending topics</p>
        </div>

        {/* Search Bar - Pill shaped */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search users or posts..."
            className="w-full pl-14 pr-28 py-4 bg-white border border-[#E2E8F0] rounded-full text-[#1E293B] placeholder-[#94A3B8] focus:border-[#7E22CE] focus:ring-4 focus:ring-[#F3E8FF] outline-none transition-all shadow-sm"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7E22CE] hover:bg-[#6B21A8] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            Search
          </button>
        </form>

        {/* Trending Topics (before search) */}
        {!hasSearched && (
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-[#7E22CE]" />
              <h2 className="font-semibold text-[#1E293B]">Trending Topics</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.tag}
                  onClick={() => { setQuery(topic.tag); handleSearch(topic.tag); }}
                  className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#7E22CE] hover:bg-[#F3E8FF]/30 transition-all group"
                >
                  <div className="w-10 h-10 gradient-bg rounded-[10px] flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1E293B] group-hover:text-[#7E22CE]">#{topic.tag}</p>
                    <p className="text-xs text-[#64748B]">{topic.posts} posts</p>
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
                className={`px-5 py-2.5 rounded-full font-medium capitalize transition-all text-sm ${
                  activeTab === tab
                    ? 'bg-[#7E22CE] text-white shadow-sm'
                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[#7E22CE] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#64748B]">Searching...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div className="space-y-6">
            {/* Users */}
            {users.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#7E22CE]" />
                  People ({users.length})
                </h2>
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-4 p-3 -mx-3 rounded-[12px] hover:bg-[#F8FAFC] transition-all animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img 
                        src={getAvatarUrl(user.profilePic)} 
                        alt={user.username} 
                        className="w-12 h-12 rounded-full object-cover bg-[#F1F5F9]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1E293B]">{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-[#64748B] line-clamp-1">{user.bio}</p>
                        )}
                      </div>
                      <span className="text-[#7E22CE] font-medium text-sm">View</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts */}
            {posts.length > 0 && (
              <div>
                <h2 className="font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7E22CE]" />
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
              <div className="card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#CBD5E1]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No results found</h3>
                <p className="text-[#64748B]">We couldn't find anything for "{query}"</p>
                <p className="text-sm text-[#94A3B8] mt-1">Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
