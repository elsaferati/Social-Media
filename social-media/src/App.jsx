import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ----------------- Components ----------------- */
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

/* ----------------- Pages ----------------- */
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import BookmarksPage from "./pages/BookmarksPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";       // You created this in the previous step
import RegisterPage from "./pages/RegisterPage"; // You created this in the previous step

/* ----------------- Protected Layout Wrapper ----------------- */
const ProtectedLayout = () => {
  const { currentUser } = useAuth();

  // 1. If user is NOT logged in, redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. If user IS logged in, show the App (Header + Sidebar + Page)
  return (
    <div className="app flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* This renders the child route (e.g., HomePage) */}
        </main>
      </div>
    </div>
  );
};

/* ----------------- Main App ----------------- */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes (Accessible without login) */}
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