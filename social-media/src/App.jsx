import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

/* ----------------- Components ----------------- */
import PostsFeed from "./components/PostsFeed";
import PostCard from "./components/PostCard";
import SuggestedUsers from "./components/SuggestedUsers";
import CreatePost from "./components/CreatePost";
import ModalSystem from "./components/ModalSystem";
import ProfileHeader from "./components/ProfileHeader";
import ChatWindow from "./components/ChatWindow";

/* ----------------- Header ----------------- */
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          &#9776; {/* Hamburger icon without react-icons */}
        </button>
        <h1 className="text-xl font-bold">My Social App</h1>
      </div>
      <div>User Menu</div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-gray-100 w-64 p-4 h-full">
            <Sidebar />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

/* ----------------- Sidebar ----------------- */
const Sidebar = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Profile", path: "/profile/1" },
    { name: "Settings", path: "/settings" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <aside className="bg-gray-100 p-4 md:w-64 w-full md:flex-shrink-0">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

/* ----------------- Pages ----------------- */

/* Home Page */
const HomePage = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState([
    { id: 1, content: "Hello world!", likes: 5, isLiked: false, userId: 2 },
    { id: 2, content: "My second post", likes: 2, isLiked: true, userId: 1 },
  ]);

  const suggestedUsers = [
    { id: 1, name: "Alice", username: "@alice" },
    { id: 2, name: "Bob", username: "@bob" },
    { id: 3, name: "Charlie", username: "@charlie" },
  ];

  const handleCreatePost = (content) => {
    setPosts([{ id: posts.length + 1, content, likes: 0, isLiked: false, userId: 1 }, ...posts]);
  };

  return (
    <div className="home-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Home</h1>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </div>
        <PostsFeed posts={posts} />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>
      {isCreatePostOpen && (
        <ModalSystem onClose={() => setIsCreatePostOpen(false)}>
          <CreatePost onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
        </ModalSystem>
      )}
    </div>
  );
};

/* Profile Page */
const ProfilePage = () => {
  const [posts, setPosts] = useState([
    { id: 1, content: "My first profile post", likes: 5, isLiked: false, userId: 1 },
    { id: 2, content: "Another post", likes: 2, isLiked: true, userId: 1 },
  ]);

  const suggestedUsers = [
    { id: 2, name: "Bob", username: "@bob" },
    { id: 3, name: "Charlie", username: "@charlie" },
  ];

  return (
    <div className="profile-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <ProfileHeader />
        <PostsFeed posts={posts} />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>
    </div>
  );
};

/* Explore Page */
const ExplorePage = () => {
  const posts = [
    { id: 1, content: "Explore post 1", likes: 3, isLiked: false, userId: 2 },
    { id: 2, content: "Explore post 2", likes: 5, isLiked: true, userId: 3 },
  ];

  const suggestedUsers = [
    { id: 1, name: "Alice", username: "@alice" },
    { id: 2, name: "Bob", username: "@bob" },
  ];

  return (
    <div className="explore-page flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <PostsFeed posts={posts} />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
        <SuggestedUsers users={suggestedUsers} />
      </div>
    </div>
  );
};

/* Bookmarks Page */
const BookmarksPage = () => {
  const posts = [
    { id: 1, content: "Bookmarked post 1", likes: 2, isLiked: false },
    { id: 2, content: "Bookmarked post 2", likes: 4, isLiked: true },
  ];

  return (
    <div className="bookmarks-page p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      <PostsFeed posts={posts} />
    </div>
  );
};

/* Notifications Page */
const NotificationsPage = () => {
  const notifications = [
    { id: 1, message: "Alice liked your post" },
    { id: 2, message: "Bob started following you" },
    { id: 3, message: "Charlie mentioned you in a comment" },
  ];

  return (
    <div className="notifications-page p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="border rounded">
        {notifications.map((n) => (
          <div key={n.id} className="p-2 border-b">
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
};

/* Settings Page */
const SettingsPage = () => {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div className="settings-page p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <ProfileHeader />
      <div className="mt-6 flex flex-col gap-4 max-w-md">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

/* Messages Page */
const MessagesPage = () => {
  return (
    <div className="messages-page flex h-full p-4">
      <ChatWindow />
    </div>
  );
};

/* ----------------- App Component ----------------- */
const App = () => {
  return (
    <Router>
      <div className="app flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
