import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { currentUser, updateUser } = useAuth();

  // State for form inputs
  const [inputs, setInputs] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "", // Keep empty unless they want to change it
  });

  const [status, setStatus] = useState(null); // null, 'success', or 'error'
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch(`http://localhost:8800/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data); // Catch duplicate errors or server errors

      // Update the AuthContext so the Header updates immediately
      updateUser(data);

      setStatus("success");
      setMessage("Settings updated successfully!");
      
      // Clear password field for security
      setInputs(prev => ({ ...prev, password: "" }));

    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="settings-page p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded shadow border">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Account Information</h2>
        
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          {/* Username */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-600">New Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="border p-2 rounded w-full focus:outline-blue-500"
            />
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-3 rounded text-sm ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 transition w-full md:w-auto"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;