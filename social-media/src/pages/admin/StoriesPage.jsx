import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import EditModal from '../../components/admin/EditModal';
import { adminAPI } from '../../services/api';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [includeExpired, setIncludeExpired] = useState(false);
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, story: null });
  const [editModal, setEditModal] = useState({ open: false, story: null });
  const [editForm, setEditForm] = useState({ content: '', expiresAt: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [currentPage, includeExpired]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStories(currentPage, 10, includeExpired);
      setStories(data.stories || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.story) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteStory(deleteModal.story.id);
      setDeleteModal({ open: false, story: null });
      fetchStories();
    } catch (err) {
      console.error('Error deleting story:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (story) => {
    setEditForm({
      content: story.content || '',
      expiresAt: story.expiresAt ? new Date(story.expiresAt).toISOString().slice(0, 16) : '',
    });
    setEditModal({ open: true, story });
  };

  const handleSaveEdit = async () => {
    if (!editModal.story) return;
    
    try {
      setActionLoading(true);
      await adminAPI.updateStory(editModal.story.id, {
        content: editForm.content,
        expiresAt: editForm.expiresAt ? new Date(editForm.expiresAt).toISOString() : null,
      });
      setEditModal({ open: false, story: null });
      fetchStories();
    } catch (err) {
      console.error('Error updating story:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'username',
      label: 'User',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {row.profilePic ? (
              <img src={row.profilePic} alt={value} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {value?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'img',
      label: 'Image',
      render: (value) => value ? (
        <img 
          src={value.startsWith('http') ? value : `http://localhost:8800${value}`} 
          alt="Story" 
          className="w-16 h-16 object-cover rounded"
        />
      ) : (
        <span className="text-gray-400">No image</span>
      ),
    },
    {
      key: 'content',
      label: 'Content',
      render: (value) => (
        <span className="text-gray-600 truncate max-w-[200px] block">
          {value || 'No content'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      render: (value) => (
        <span className="text-gray-600">{value || 0}</span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isExpired(value)
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {value ? format(new Date(value), 'MMM d, yyyy HH:mm') : 'N/A'}
        </span>
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
          <p className="text-gray-500 mt-1">Manage user stories</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeExpired}
            onChange={(e) => setIncludeExpired(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">Include expired</span>
        </label>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={stories}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={(story) => setDeleteModal({ open: true, story })}
        searchPlaceholder="Search stories..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, story: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Story"
        message={`Are you sure you want to delete this story by "${deleteModal.story?.username}"?`}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, story: null })}
        onSave={handleSaveEdit}
        loading={actionLoading}
        title="Edit Story"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Story content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires At
            </label>
            <input
              type="datetime-local"
              value={editForm.expiresAt}
              onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default StoriesPage;
