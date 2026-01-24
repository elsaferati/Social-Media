import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ----------------- Pages ----------------- */
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import BookmarksPage from "./pages/BookmarksPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";

/* ----------------- Admin Pages ----------------- */
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminPostsPage from "./pages/admin/PostsPage";
import AdminCommentsPage from "./pages/admin/CommentsPage";
import AdminMessagesPage from "./pages/admin/MessagesPage";

/* ----------------- Protected Route Wrapper ----------------- */
const ProtectedLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

/* ----------------- Admin Protected Route Wrapper ----------------- */
const AdminProtectedLayout = () => {
  const { currentUser, isAdmin } = useAuth();

  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Logged in but not admin - redirect to home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

/* ----------------- Main App ----------------- */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (Requires Login) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          {/* Admin Routes (Requires Admin Role) */}
          <Route element={<AdminProtectedLayout />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="posts" element={<AdminPostsPage />} />
              <Route path="comments" element={<AdminCommentsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
