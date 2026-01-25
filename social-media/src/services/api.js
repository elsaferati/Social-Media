// API Service Layer
const API_BASE_URL = 'http://localhost:8800/api';

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
};

// ==================== USERS ====================
export const userAPI = {
  getUser: (userId) => fetchWithAuth(`/users/${userId}`),
  
  updateUser: (userId, data) =>
    fetchWithAuth(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

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
  admin: adminAPI,
};
