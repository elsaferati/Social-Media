import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import EditModal from '../../components/admin/EditModal';
import { adminAPI } from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user', bio: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers(currentPage, 10, searchTerm);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteUser(deleteModal.user.id);
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      bio: user.bio || '',
    });
    setEditModal({ open: true, user });
  };

  const handleSaveEdit = async () => {
    if (!editModal.user) return;
    
    try {
      setActionLoading(true);
      await adminAPI.updateUser(editModal.user.id, editForm);
      setEditModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
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
      key: 'username',
      label: 'Username',
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
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value || 'user'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
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
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={(user) => setDeleteModal({ open: true, user })}
        searchPlaceholder="Search users..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.user?.username}"? This will also delete all their posts, comments, and messages.`}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        onSave={handleSaveEdit}
        loading={actionLoading}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </EditModal>
    </div>
  );
};

export default UsersPage;
