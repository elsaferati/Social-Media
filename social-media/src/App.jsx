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

/* ----------------- Protected Route Wrapper ----------------- */
// This component now ONLY handles security. 
// The Visual Layout (Sidebar/Header) is handled inside each Page component.
const ProtectedLayout = () => {
  const { currentUser } = useAuth();

  // 1. If user is NOT logged in, redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. If user IS logged in, render the requested page
  // The pages themselves (HomePage, etc.) now contain the <Layout> wrapper
  return <Outlet />;
};

/* ----------------- Main App ----------------- */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes (No Sidebar needed) */}
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
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;