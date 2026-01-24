import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import { adminAPI } from '../../services/api';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, comment: null });
  const [viewModal, setViewModal] = useState({ open: false, comment: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [currentPage, searchTerm]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getComments(currentPage, 10, searchTerm);
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.comment) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteComment(deleteModal.comment.id);
      setDeleteModal({ open: false, comment: null });
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
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
      label: 'Comment',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-700">
          {value?.length > 40 ? `${value.substring(0, 40)}...` : value}
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
      key: 'postContent',
      label: 'On Post',
      render: (value) => (
        <div className="max-w-[150px] truncate text-gray-500 text-sm">
          {value?.length > 30 ? `${value.substring(0, 30)}...` : value}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? format(new Date(value), 'MMM d, yyyy') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-500 mt-1">Manage all comments on the platform</p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={comments}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onView={(comment) => setViewModal({ open: true, comment })}
        onDelete={(comment) => setDeleteModal({ open: true, comment })}
        searchPlaceholder="Search comments..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, comment: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
      />

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewModal({ open: false, comment: null })}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Comment Details</h3>
            </div>
            <div className="p-6">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {viewModal.comment?.profilePic ? (
                    <img src={viewModal.comment.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {viewModal.comment?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{viewModal.comment?.username}</p>
                  <p className="text-sm text-gray-500">
                    {viewModal.comment?.createdAt && format(new Date(viewModal.comment.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              {/* Comment Content */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Comment</p>
                <p className="text-gray-700 whitespace-pre-wrap">{viewModal.comment?.content}</p>
              </div>

              {/* Original Post */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Original Post</p>
                <p className="text-gray-600 text-sm">{viewModal.comment?.postContent}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setViewModal({ open: false, comment: null })}
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

export default CommentsPage;
