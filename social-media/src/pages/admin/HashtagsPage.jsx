import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import EditModal from '../../components/admin/EditModal';
import { adminAPI } from '../../services/api';

const HashtagsPage = () => {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, hashtag: null });
  const [editModal, setEditModal] = useState({ open: false, hashtag: null });
  const [createModal, setCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', isBlocked: false });
  const [createForm, setCreateForm] = useState({ name: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHashtags();
  }, [currentPage, searchTerm]);

  const fetchHashtags = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getHashtags(currentPage, 10, searchTerm);
      setHashtags(data.hashtags || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching hashtags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.hashtag) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteHashtag(deleteModal.hashtag.id);
      setDeleteModal({ open: false, hashtag: null });
      fetchHashtags();
    } catch (err) {
      console.error('Error deleting hashtag:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (hashtag) => {
    setEditForm({
      name: hashtag.name,
      isBlocked: hashtag.isBlocked === 1,
    });
    setEditModal({ open: true, hashtag });
  };

  const handleSaveEdit = async () => {
    if (!editModal.hashtag) return;
    
    try {
      setActionLoading(true);
      await adminAPI.updateHashtag(editModal.hashtag.id, editForm);
      setEditModal({ open: false, hashtag: null });
      fetchHashtags();
    } catch (err) {
      console.error('Error updating hashtag:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    
    try {
      setActionLoading(true);
      await adminAPI.createHashtag({ name: createForm.name });
      setCreateModal(false);
      setCreateForm({ name: '' });
      fetchHashtags();
    } catch (err) {
      console.error('Error creating hashtag:', err);
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
      key: 'name',
      label: 'Hashtag',
      render: (value) => (
        <span className="font-medium text-blue-600">#{value}</span>
      ),
    },
    {
      key: 'usageCount',
      label: 'Usage Count',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {value || 0} posts
        </span>
      ),
    },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {value === 1 ? 'Blocked' : 'Active'}
        </span>
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hashtags</h1>
          <p className="text-gray-500 mt-1">Manage hashtags and trending topics</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Hashtag
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={hashtags}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={(hashtag) => setDeleteModal({ open: true, hashtag })}
        searchPlaceholder="Search hashtags..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, hashtag: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Hashtag"
        message={`Are you sure you want to delete "#${deleteModal.hashtag?.name}"? This will remove it from all posts.`}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, hashtag: null })}
        onSave={handleSaveEdit}
        loading={actionLoading}
        title="Edit Hashtag"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtag Name
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">#</span>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isBlocked}
                onChange={(e) => setEditForm({ ...editForm, isBlocked: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Block this hashtag</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Blocked hashtags won't appear in searches or trending</p>
          </div>
        </div>
      </EditModal>

      {/* Create Modal */}
      <EditModal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); setCreateForm({ name: '' }); }}
        onSave={handleCreate}
        loading={actionLoading}
        title="Create Hashtag"
        saveText="Create"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtag Name
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">#</span>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter hashtag name"
              />
            </div>
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default HashtagsPage;
