import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import { adminAPI } from '../../services/api';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, post: null });
  const [viewModal, setViewModal] = useState({ open: false, post: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPosts(currentPage, 10, searchTerm);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deletePost(deleteModal.post.id);
      setDeleteModal({ open: false, post: null });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'content',
      label: 'Content',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-700">
          {value?.length > 50 ? `${value.substring(0, 50)}...` : value}
        </div>
      ),
    },
    {
      key: 'username',
      label: 'Author',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {row.profilePic ? (
              <img src={row.profilePic} alt={value} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {value?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? format(new Date(value), 'MMM d, yyyy HH:mm') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <p className="text-gray-500 mt-1">Manage all posts on the platform</p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onView={(post) => setViewModal({ open: true, post })}
        onDelete={(post) => setDeleteModal({ open: true, post })}
        searchPlaceholder="Search posts..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, post: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Post"
        message="Are you sure you want to delete this post? This will also delete all comments and likes on this post."
      />

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewModal({ open: false, post: null })}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {viewModal.post?.profilePic ? (
                    <img src={viewModal.post.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {viewModal.post?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{viewModal.post?.username}</p>
                  <p className="text-sm text-gray-500">
                    {viewModal.post?.createdAt && format(new Date(viewModal.post.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{viewModal.post?.content}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setViewModal({ open: false, post: null })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
