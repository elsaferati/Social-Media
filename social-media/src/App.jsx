import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import ExplorePage from "./pages/ExplorePage";
import NotificationsPage from "./pages/NotificationsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";

const App = () => {
  return (
    <Router>
      <div className="app flex flex-col h-screen">
        {/* Header */}
        <Header />

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
