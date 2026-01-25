import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import EditModal from '../../components/admin/EditModal';
import { adminAPI } from '../../services/api';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, report: null });
  const [editModal, setEditModal] = useState({ open: false, report: null });
  const [editForm, setEditForm] = useState({ status: '', adminNotes: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getReports(currentPage, 10, statusFilter, typeFilter);
      setReports(data.reports || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.report) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteReport(deleteModal.report.id);
      setDeleteModal({ open: false, report: null });
      fetchReports();
    } catch (err) {
      console.error('Error deleting report:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (report) => {
    setEditForm({
      status: report.status || 'pending',
      adminNotes: report.adminNotes || '',
    });
    setEditModal({ open: true, report });
  };

  const handleSaveEdit = async () => {
    if (!editModal.report) return;
    
    try {
      setActionLoading(true);
      await adminAPI.updateReport(editModal.report.id, editForm);
      setEditModal({ open: false, report: null });
      fetchReports();
    } catch (err) {
      console.error('Error updating report:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReasonLabel = (reason) => {
    const labels = {
      spam: 'Spam',
      harassment: 'Harassment',
      hate_speech: 'Hate Speech',
      violence: 'Violence',
      nudity: 'Nudity',
      false_info: 'False Information',
      other: 'Other'
    };
    return labels[reason] || reason;
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'reporterUsername',
      label: 'Reporter',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {row.reporterProfilePic ? (
              <img src={row.reporterProfilePic} alt={value} className="w-full h-full object-cover" />
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
      key: 'reportType',
      label: 'Type',
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => (
        <span className="text-gray-600">{getReasonLabel(value)}</span>
      ),
    },
    {
      key: 'reportedUsername',
      label: 'Reported User',
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Manage content reports</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="user">User</option>
          <option value="post">Post</option>
          <option value="comment">Comment</option>
          <option value="story">Story</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={(report) => setDeleteModal({ open: true, report })}
        searchPlaceholder="Search reports..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, report: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, report: null })}
        onSave={handleSaveEdit}
        loading={actionLoading}
        title="Review Report"
      >
        <div className="space-y-4">
          {editModal.report && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600"><strong>Reporter:</strong> {editModal.report.reporterUsername}</p>
              <p className="text-sm text-gray-600"><strong>Type:</strong> {editModal.report.reportType}</p>
              <p className="text-sm text-gray-600"><strong>Reason:</strong> {getReasonLabel(editModal.report.reason)}</p>
              {editModal.report.description && (
                <p className="text-sm text-gray-600 mt-2"><strong>Description:</strong> {editModal.report.description}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes
            </label>
            <textarea
              value={editForm.adminNotes}
              onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add notes about this report..."
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default ReportsPage;
