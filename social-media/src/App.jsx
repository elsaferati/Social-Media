import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";

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
          <FaBars />
        </button>
        <h1 className="text-xl font-bold">My Social App</h1>
      </div>
      <div>User Menu</div>

      {/* Mobile Sidebar overlay */}
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

/* ----------------- PostsFeed ----------------- */
const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="post-card p-4 border mb-4 rounded">
      <p>{post.content}</p>
      <button
        onClick={toggleLike}
        className={`px-2 py-1 rounded mt-2 ${liked ? "bg-red-500 text-white" : "bg-gray-200"}`}
      >
        {liked ? "Unlike" : "Like"} ({likesCount})
      </button>
    </div>
  );
};

const PostsFeed = ({ posts }) => {
  return (
    <div className="posts-feed flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

/* ----------------- SuggestedUsers ----------------- */
const SuggestedUsers = ({ users }) => (
  <div className="suggested-users p-4 border rounded mb-4">
    <h3 className="font-bold mb-2">Suggested Users</h3>
    {users.map((user) => (
      <div key={user.id} className="flex justify-between items-center mb-2">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-gray-500 text-sm">{user.username}</p>
        </div>
        <button className="bg-blue-500 text-white px-2 py-1 rounded">Follow</button>
      </div>
    ))}
  </div>
);

/* ----------------- CreatePost & Modal ----------------- */
const CreatePost = ({ onClose, onPost }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content);
    setContent("");
    onClose();
  };

  return (
    <div className="create-post flex flex-col">
      <textarea
        className="border p-2 mb-2 rounded"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

const ModalSystem = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded relative w-full max-w-md">
      <button className="absolute top-2 right-2" onClick={onClose}>X</button>
      {children}
    </div>
  </div>
);

/* ----------------- Pages ----------------- */
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
    const newPost = {
      id: posts.length + 1,
      content,
      likes: 0,
      isLiked: false,
      userId: 1,
    };
    setPosts([newPost, ...posts]);
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

const ProfilePage = () => <div>Profile Page</div>;
const ExplorePage = () => <div>Explore Page</div>;
const NotificationsPage = () => <div>Notifications Page</div>;
const BookmarksPage = () => <div>Bookmarks Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const MessagesPage = () => <div>Messages Page</div>;

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
