import React from "react";

function Header() {
  return (
    <header
      className="bg-white border-b border-[var(--border-color)] sticky top-0 z-50"
      data-name="header"
      data-file="components/Header.js"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold text-[var(--primary-color)]">
              SocialHub
            </a>

            <nav className="hidden md:flex items-center gap-1">
              <a href="/" className="nav-item flex items-center gap-2">
                <div className="icon-home text-xl"></div>
                <span>Home</span>
              </a>

              <a href="/profile" className="nav-item flex items-center gap-2">
                <div className="icon-user text-xl"></div>
                <span>Profile</span>
              </a>

              <a href="/messages" className="nav-item flex items-center gap-2">
                <div className="icon-message-circle text-xl"></div>
                <span>Messages</span>
              </a>
            </nav>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-color)] w-64"
              />
              <div className="icon-search text-lg text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2"></div>
            </div>

            <button className="w-10 h-10 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
              <div className="icon-bell text-xl text-[var(--primary-color)]"></div>
            </button>

            <img
              src="https://i.pravatar.cc/150?img=1"
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
