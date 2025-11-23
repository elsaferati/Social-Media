import React, { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";

const SettingsPage = () => {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved!");
    // TODO: connect to backend API
  };

  return (
    <div className="settings-page p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      {/* Profile info */}
      <ProfileHeader />

      {/* Settings form */}
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

export default SettingsPage;
