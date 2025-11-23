import React from "react";

function Sidebar({ activePage }) {
  const menuItems = [
    { icon: "home", label: "Home", href: "/", page: "home" },
    { icon: "compass", label: "Explore", href: "#", page: "explore" },
    { icon: "bell", label: "Notifications", href: "#", page: "notifications" },
    { icon: "message-circle", label: "Messages", href: "/messages", page: "messages" },
    { icon: "bookmark", label: "Bookmarks", href: "#", page: "bookmarks" },
    { icon: "user", label: "Profile", href: "/profile", page: "profile" },
    { icon: "settings", label: "Settings", href: "#", page: "settings" },
  ];

  return (
    <div
      className="card p-4"
      data-name="sidebar"
      data-file="components/Sidebar.js"
    >
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.page}
            href={item.href}
            className={
              activePage === item.page ? "nav-item-active" : "nav-item"
            }
          >
            <div className={`icon-${item.icon} text-xl`} />
            <span className="text-base">{item.label}</span>
          </a>
        ))}
      </nav>

      <button className="btn-primary w-full mt-6">Post</button>
    </div>
  );
}

export default Sidebar;
