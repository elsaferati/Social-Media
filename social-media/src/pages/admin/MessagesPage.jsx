import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DataTable from '../../components/admin/DataTable';
import DeleteModal from '../../components/admin/DeleteModal';
import { adminAPI } from '../../services/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, message: null });
  const [viewModal, setViewModal] = useState({ open: false, message: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getMessages(currentPage, 10, searchTerm);
      setMessages(data.messages);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.message) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteMessage(deleteModal.message.id);
      setDeleteModal({ open: false, message: null });
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
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
      key: 'senderUsername',
      label: 'From',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {row.senderPic ? (
              <img src={row.senderPic} alt={value} className="w-full h-full object-cover" />
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
      key: 'receiverUsername',
      label: 'To',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {row.receiverPic ? (
              <img src={row.receiverPic} alt={value} className="w-full h-full object-cover" />
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
      key: 'content',
      label: 'Message',
      render: (value) => (
        <div className="max-w-[200px] truncate text-gray-700">
          {value?.length > 40 ? `${value.substring(0, 40)}...` : value}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Sent',
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {value ? format(new Date(value), 'MMM d, HH:mm') : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">View and manage all messages on the platform</p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onView={(message) => setViewModal({ open: true, message })}
        onDelete={(message) => setDeleteModal({ open: true, message })}
        searchPlaceholder="Search messages..."
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, message: null })}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewModal({ open: false, message: null })}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
            </div>
            <div className="p-6">
              {/* Sender & Receiver */}
              <div className="flex items-center justify-between mb-6">
                {/* Sender */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {viewModal.message?.senderPic ? (
                      <img src={viewModal.message.senderPic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {viewModal.message?.senderUsername?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-medium text-gray-900">{viewModal.message?.senderUsername}</p>
                  </div>
                </div>

                <span className="text-gray-300">→</span>

                {/* Receiver */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {viewModal.message?.receiverPic ? (
                      <img src={viewModal.message.receiverPic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {viewModal.message?.receiverUsername?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-medium text-gray-900">{viewModal.message?.receiverUsername}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {viewModal.message?.createdAt && format(new Date(viewModal.message.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{viewModal.message?.content}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setViewModal({ open: false, message: null })}
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

export default MessagesPage;
