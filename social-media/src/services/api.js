// API Service Layer
const API_BASE_URL = 'http://localhost:8800/api';
const UPLOADS_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

// Single unknown/default avatar for all users without a profile photo (neutral person icon)
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

// Resolve profile pic URL: use full URL for uploads, or return default avatar
export const getAvatarUrl = (profilePic) => {
  if (!profilePic) return DEFAULT_AVATAR;
  if (profilePic.startsWith('http') || profilePic.startsWith('data:')) return profilePic;
  return `${UPLOADS_ORIGIN}${profilePic.startsWith('/') ? '' : '/'}${profilePic}`;
};

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Base fetch function with auth header
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  if (!response.ok) {
    throw new Error('An error occurred');
  }

  return response.text();
};

// ==================== AUTH ====================
export const authAPI = {
  login: (email, password) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (username, email, password) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  getCurrentUser: () => fetchWithAuth('/auth/me'),

  deleteAccount: (password) =>
    fetchWithAuth('/auth/delete-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// ==================== USERS ====================
export const userAPI = {
  getUser: (userId) => fetchWithAuth(`/users/${userId}`),
  
  updateUser: (userId, data) =>
    fetchWithAuth(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateProfilePic: async (userId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', file);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to upload photo');
    }
    return response.json();
  },

  getSuggestions: (userId) => fetchWithAuth(`/users/suggestions/${userId}`),
  
  getFriends: (userId) => fetchWithAuth(`/users/friends/${userId}`),
  
  getFollowers: (userId) => fetchWithAuth(`/users/followers/${userId}`),
  
  getFollowing: (userId) => fetchWithAuth(`/users/following/${userId}`),
};

// ==================== RELATIONSHIPS ====================
export const relationshipAPI = {
  follow: (followerUserId, followedUserId) =>
    fetchWithAuth('/relationships', {
      method: 'POST',
      body: JSON.stringify({ followerUserId, followedUserId }),
    }),

  unfollow: (followerUserId, followedUserId) =>
    fetchWithAuth(`/relationships?followerUserId=${followerUserId}&followedUserId=${followedUserId}`, {
      method: 'DELETE',
    }),

  getCounts: (userId) => fetchWithAuth(`/relationships/count/${userId}`),
  
  checkFollowing: (followerUserId, followedUserId) =>
    fetchWithAuth(`/users/relationships/check?followerUserId=${followerUserId}&followedUserId=${followedUserId}`),
};

// ==================== POSTS ====================
export const postAPI = {
  getAll: (page = 1, limit = 20) => 
    fetchWithAuth(`/posts?page=${page}&limit=${limit}`),

  getFeed: (userId, page = 1, limit = 20) => 
    fetchWithAuth(`/posts/feed/${userId}?page=${page}&limit=${limit}`),

  getById: (id) => fetchWithAuth(`/posts/${id}`),

  getByUser: (userId) => fetchWithAuth(`/posts/user/${userId}`),

  getExplore: (limit = 20) => fetchWithAuth(`/posts/explore?limit=${limit}`),

  getBookmarked: (userId) => fetchWithAuth(`/posts/bookmarks/${userId}`),

  create: (content, userId) =>
    fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, userId }),
    }),

  update: (id, content) =>
    fetchWithAuth(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  delete: (id) =>
    fetchWithAuth(`/posts/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== LIKES ====================
export const likeAPI = {
  getLikes: (postId) => fetchWithAuth(`/likes?postId=${postId}`),

  toggleLike: (userId, postId) =>
    fetchWithAuth('/likes', {
      method: 'POST',
      body: JSON.stringify({ userId, postId }),
    }),
};

// ==================== BOOKMARKS ====================
export const bookmarkAPI = {
  toggle: (userId, postId) =>
    fetchWithAuth('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ userId, postId }),
    }),

  check: (userId, postId) =>
    fetchWithAuth(`/bookmarks/check?userId=${userId}&postId=${postId}`),
};

// ==================== COMMENTS ====================
export const commentAPI = {
  getByPost: (postId) => fetchWithAuth(`/comments/${postId}`),

  create: (content, userId, postId) =>
    fetchWithAuth('/comments', {
      method: 'POST',
      body: JSON.stringify({ content, userId, postId }),
    }),

  update: (id, content) =>
    fetchWithAuth(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  delete: (id) =>
    fetchWithAuth(`/comments/${id}`, {
      method: 'DELETE',
    }),

  getCount: (postId) => fetchWithAuth(`/comments/count/${postId}`),
};

// ==================== MESSAGES ====================
export const messageAPI = {
  getMessages: (senderId, receiverId) =>
    fetchWithAuth(`/messages?senderId=${senderId}&receiverId=${receiverId}`),

  send: (senderId, receiverId, content) =>
    fetchWithAuth('/messages', {
      method: 'POST',
      body: JSON.stringify({ senderId, receiverId, content }),
    }),

  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/messages/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    return response.json();
  },

  update: (id, content) =>
    fetchWithAuth(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  delete: (id) =>
    fetchWithAuth(`/messages/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== NOTIFICATIONS ====================
export const notificationAPI = {
  getAll: (userId) => fetchWithAuth(`/notifications?userId=${userId}`),

  markAsRead: (id) =>
    fetchWithAuth(`/notifications/read/${id}`, {
      method: 'PUT',
    }),

  markAllAsRead: (userId) =>
    fetchWithAuth(`/notifications/read-all/${userId}`, {
      method: 'PUT',
    }),

  getUnreadCount: (userId) => fetchWithAuth(`/notifications/unread/${userId}`),
};

// ==================== SEARCH ====================
export const searchAPI = {
  users: (query, limit = 10) =>
    fetchWithAuth(`/search/users?q=${encodeURIComponent(query)}&limit=${limit}`),

  posts: (query, limit = 20) =>
    fetchWithAuth(`/search/posts?q=${encodeURIComponent(query)}&limit=${limit}`),

  all: (query) =>
    fetchWithAuth(`/search?q=${encodeURIComponent(query)}`),
};

// ==================== STORIES ====================
export const storyAPI = {
  getFeed: (userId) => fetchWithAuth(`/stories/feed/${userId}`),

  getByUser: (userId) => fetchWithAuth(`/stories/user/${userId}`),

  getById: (id) => fetchWithAuth(`/stories/${id}`),

  getViewers: (id) => fetchWithAuth(`/stories/${id}/viewers`),

  view: (storyId, userId) =>
    fetchWithAuth(`/stories/${storyId}/view`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  delete: (id) =>
    fetchWithAuth(`/stories/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== HASHTAGS ====================
export const hashtagAPI = {
  getTrending: (limit = 10) => fetchWithAuth(`/hashtags/trending?limit=${limit}`),

  search: (query, limit = 10) =>
    fetchWithAuth(`/hashtags/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  getByName: (name) => fetchWithAuth(`/hashtags/name/${encodeURIComponent(name)}`),

  getPosts: (hashtagId, page = 1, limit = 20) =>
    fetchWithAuth(`/hashtags/${hashtagId}/posts?page=${page}&limit=${limit}`),
};

// ==================== REPORTS ====================
export const reportAPI = {
  create: (reporterUserId, data) =>
    fetchWithAuth('/reports', {
      method: 'POST',
      body: JSON.stringify({ reporterUserId, ...data }),
    }),
};

// ==================== ADMIN ====================
export const adminAPI = {
  getStats: () => fetchWithAuth('/admin/stats'),

  // Users
  getUsers: (page = 1, limit = 10, search = '') =>
    fetchWithAuth(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getUser: (id) => fetchWithAuth(`/admin/users/${id}`),

  updateUser: (id, data) =>
    fetchWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (id) =>
    fetchWithAuth(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // Posts
  getPosts: (page = 1, limit = 10, search = '') =>
    fetchWithAuth(`/admin/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  deletePost: (id) =>
    fetchWithAuth(`/admin/posts/${id}`, {
      method: 'DELETE',
    }),

  // Comments
  getComments: (page = 1, limit = 10, search = '') =>
    fetchWithAuth(`/admin/comments?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  deleteComment: (id) =>
    fetchWithAuth(`/admin/comments/${id}`, {
      method: 'DELETE',
    }),

  // Messages
  getMessages: (page = 1, limit = 10, search = '') =>
    fetchWithAuth(`/admin/messages?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  deleteMessage: (id) =>
    fetchWithAuth(`/admin/messages/${id}`, {
      method: 'DELETE',
    }),

  // Stories
  getStories: (page = 1, limit = 10, includeExpired = false) =>
    fetchWithAuth(`/admin/stories?page=${page}&limit=${limit}&includeExpired=${includeExpired}`),

  getStory: (id) => fetchWithAuth(`/admin/stories/${id}`),

  updateStory: (id, data) =>
    fetchWithAuth(`/admin/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteStory: (id) =>
    fetchWithAuth(`/admin/stories/${id}`, {
      method: 'DELETE',
    }),

  // Reports
  getReports: (page = 1, limit = 10, status = '', reportType = '') =>
    fetchWithAuth(`/admin/reports?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${reportType ? `&reportType=${reportType}` : ''}`),

  getReport: (id) => fetchWithAuth(`/admin/reports/${id}`),

  updateReport: (id, data) =>
    fetchWithAuth(`/admin/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReport: (id) =>
    fetchWithAuth(`/admin/reports/${id}`, {
      method: 'DELETE',
    }),

  // Hashtags
  getHashtags: (page = 1, limit = 10, search = '') =>
    fetchWithAuth(`/admin/hashtags?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getHashtag: (id) => fetchWithAuth(`/admin/hashtags/${id}`),

  createHashtag: (data) =>
    fetchWithAuth('/admin/hashtags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateHashtag: (id, data) =>
    fetchWithAuth(`/admin/hashtags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteHashtag: (id) =>
    fetchWithAuth(`/admin/hashtags/${id}`, {
      method: 'DELETE',
    }),

  // Activity Logs
  getActivityLogs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.action) queryParams.append('action', params.action);
    if (params.entityType) queryParams.append('entityType', params.entityType);
    return fetchWithAuth(`/admin/activity-logs?${queryParams.toString()}`);
  },

  getActivityLog: (id) => fetchWithAuth(`/admin/activity-logs/${id}`),

  updateActivityLog: (id, data) =>
    fetchWithAuth(`/admin/activity-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteActivityLog: (id) =>
    fetchWithAuth(`/admin/activity-logs/${id}`, {
      method: 'DELETE',
    }),
};

export default {
  auth: authAPI,
  user: userAPI,
  relationship: relationshipAPI,
  post: postAPI,
  like: likeAPI,
  bookmark: bookmarkAPI,
  comment: commentAPI,
  message: messageAPI,
  notification: notificationAPI,
  search: searchAPI,
  story: storyAPI,
  hashtag: hashtagAPI,
  report: reportAPI,
  admin: adminAPI,
};
