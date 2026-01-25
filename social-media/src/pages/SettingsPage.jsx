import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { userAPI } from "../services/api";

const SettingsPage = () => {
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [inputs, setInputs] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "", 
    bio: currentUser?.bio || "",
  });

  const [passwordInputs, setPasswordInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState(null); 
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    
    try {
      const data = await userAPI.updateUser(currentUser.id, {
        username: inputs.username,
        email: inputs.email,
        bio: inputs.bio,
        password: inputs.password || undefined
      });
      
      updateUser(data);
      setStatus("success");
      setMessage("Profile saved successfully!");
      setInputs(prev => ({ ...prev, password: "" }));
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to update profile.");
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    
    if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    if (passwordInputs.newPassword.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setStatus("loading");
    setMessage("");
    
    try {
      await userAPI.updateUser(currentUser.id, {
        username: currentUser.username,
        email: currentUser.email,
        password: passwordInputs.newPassword
      });
      
      setStatus("success");
      setMessage("Password changed successfully!");
      setPasswordInputs({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to change password.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'password':
        return (
          <form className="flex flex-col gap-6 max-w-md" onSubmit={handlePasswordSave}>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="font-bold w-40 text-right hidden md:block">Current Password</label>
              <label className="font-bold md:hidden">Current Password</label>
              <input 
                type="password" 
                name="currentPassword" 
                value={passwordInputs.currentPassword} 
                onChange={handlePasswordChange} 
                className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none" 
                placeholder="Enter current password"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="font-bold w-40 text-right hidden md:block">New Password</label>
              <label className="font-bold md:hidden">New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                value={passwordInputs.newPassword} 
                onChange={handlePasswordChange} 
                className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none" 
                placeholder="Enter new password"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label className="font-bold w-40 text-right hidden md:block">Confirm Password</label>
              <label className="font-bold md:hidden">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={passwordInputs.confirmPassword} 
                onChange={handlePasswordChange} 
                className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none" 
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mt-4">
              <div className="w-40 hidden md:block"></div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {status === 'loading' ? 'Saving...' : 'Change Password'}
              </button>
            </div>

            {message && (
              <div className={`mt-4 text-center text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </div>
            )}
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Push Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Likes</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between">
                <span>Comments</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between">
                <span>New Followers</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between">
                <span>Direct Messages</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Note: Push notification settings are stored locally in this demo.
            </p>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Privacy and Security</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Private Account</span>
                <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between">
                <span>Show Activity Status</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between">
                <span>Allow Tagging</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500" />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Note: Privacy settings are stored locally in this demo.
            </p>
          </div>
        );

      default:
        return (
          <>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src={currentUser?.profilePic || "https://i.pravatar.cc/150?u=" + currentUser?.id} className="w-full h-full object-cover" alt=""/>
              </div>
              <div>
                <div className="font-semibold text-lg leading-tight">{currentUser?.username}</div>
                <button className="text-blue-500 text-sm font-bold">Change Profile Photo</button>
              </div>
            </div>

            <form className="flex flex-col gap-6 max-w-md" onSubmit={handleSave}>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="font-bold w-32 text-right hidden md:block">Username</label>
                <label className="font-bold md:hidden">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={inputs.username} 
                  onChange={handleChange} 
                  className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none" 
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <label className="font-bold w-32 text-right hidden md:block">Email</label>
                <label className="font-bold md:hidden">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={inputs.email} 
                  onChange={handleChange} 
                  className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none" 
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
                <label className="font-bold w-32 text-right hidden md:block pt-2">Bio</label>
                <label className="font-bold md:hidden">Bio</label>
                <textarea 
                  name="bio"
                  value={inputs.bio}
                  onChange={handleChange}
                  rows="3"
                  className="border border-gray-300 rounded px-3 py-2 flex-1 focus:border-black outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mt-4">
                <div className="w-32 hidden md:block"></div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Saving...' : 'Submit'}
                </button>
              </div>

              {message && (
                <div className={`mt-4 text-center text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </div>
              )}
            </form>
          </>
        );
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[800px] bg-white border border-gray-200 rounded-lg flex overflow-hidden min-h-[500px] mt-4">
        
        {/* Left Sidebar (Settings Menu) */}
        <div className="w-1/4 border-r border-gray-200 hidden md:block">
          <div 
            onClick={() => { setActiveTab('profile'); setMessage(''); }}
            className={`p-4 cursor-pointer ${activeTab === 'profile' ? 'font-bold border-l-2 border-black' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Edit Profile
          </div>
          <div 
            onClick={() => { setActiveTab('password'); setMessage(''); }}
            className={`p-4 cursor-pointer ${activeTab === 'password' ? 'font-bold border-l-2 border-black' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Change Password
          </div>
          <div 
            onClick={() => { setActiveTab('notifications'); setMessage(''); }}
            className={`p-4 cursor-pointer ${activeTab === 'notifications' ? 'font-bold border-l-2 border-black' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Push Notifications
          </div>
          <div 
            onClick={() => { setActiveTab('privacy'); setMessage(''); }}
            className={`p-4 cursor-pointer ${activeTab === 'privacy' ? 'font-bold border-l-2 border-black' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Privacy and Security
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">
          <h2 className="text-xl mb-6 md:hidden capitalize">{activeTab === 'profile' ? 'Edit Profile' : activeTab.replace('_', ' ')}</h2>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
