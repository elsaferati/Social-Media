import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import EditModal from '../../components/admin/EditModal';
import { adminAPI } from '../../services/api';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, log: null });
  const [editModal, setEditModal] = useState({ open: false, log: null });
  const [editForm, setEditForm] = useState({ action: '', entityType: '', entityId: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, entityTypeFilter, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 20 };
      if (entityTypeFilter) params.entityType = entityTypeFilter;
      if (actionFilter) params.action = actionFilter;
      
      const data = await adminAPI.getActivityLogs(params);
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.log) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteActivityLog(deleteModal.log.id);
      setDeleteModal({ open: false, log: null });
      fetchLogs();
    } catch (err) {
      console.error('Error deleting log:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (log) => {
    setEditForm({
      action: log.action || '',
      entityType: log.entityType || '',
      entityId: log.entityId || '',
    });
    setEditModal({ open: true, log });
  };

  const handleSaveEdit = async () => {
    if (!editModal.log) return;
    
    try {
      setActionLoading(true);
      await adminAPI.updateActivityLog(editModal.log.id, {
        action: editForm.action,
        entityType: editForm.entityType,
        entityId: editForm.entityId ? parseInt(editForm.entityId) : null,
      });
      setEditModal({ open: false, log: null });
      fetchLogs();
    } catch (err) {
      console.error('Error updating log:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('delete')) return 'bg-red-100 text-red-700';
    if (action.includes('create')) return 'bg-green-100 text-green-700';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-100 text-blue-700';
    if (action.includes('login')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
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
        <div className="flex items-center gap-2">
          {row.profilePic ? (
            <img src={row.profilePic} alt={value} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {value?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
          )}
          <span className="text-gray-900">{value || 'System'}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(value)}`}>
          {value.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'entityType',
      label: 'Entity Type',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'entityId',
      label: 'Entity ID',
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (value) => (
        <span className="text-gray-500 text-sm font-mono">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Time',
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? format(new Date(value), 'MMM d, HH:mm:ss') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 mt-1">Monitor user and system activity</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={entityTypeFilter}
          onChange={(e) => { setEntityTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Entity Types</option>
          <option value="user">User</option>
          <option value="post">Post</option>
          <option value="comment">Comment</option>
          <option value="story">Story</option>
          <option value="report">Report</option>
          <option value="hashtag">Hashtag</option>
          <option value="system">System</option>
        </select>
        <input
          type="text"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
          placeholder="Filter by action..."
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={(log) => setDeleteModal({ open: true, log })}
        searchPlaceholder="Search logs..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, log: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Activity Log"
        message="Are you sure you want to delete this activity log entry?"
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, log: null })}
        onSave={handleSaveEdit}
        loading={actionLoading}
        title="Edit Activity Log"
      >
        <div className="space-y-4">
          {editModal.log && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600"><strong>User:</strong> {editModal.log.username || 'System'}</p>
              <p className="text-sm text-gray-600"><strong>IP:</strong> {editModal.log.ipAddress || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Time:</strong> {editModal.log.createdAt ? format(new Date(editModal.log.createdAt), 'PPpp') : 'N/A'}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <input
              type="text"
              value={editForm.action}
              onChange={(e) => setEditForm({ ...editForm, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={editForm.entityType}
              onChange={(e) => setEditForm({ ...editForm, entityType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="post">Post</option>
              <option value="comment">Comment</option>
              <option value="story">Story</option>
              <option value="report">Report</option>
              <option value="hashtag">Hashtag</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity ID
            </label>
            <input
              type="number"
              value={editForm.entityId}
              onChange={(e) => setEditForm({ ...editForm, entityId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default ActivityLogsPage;
