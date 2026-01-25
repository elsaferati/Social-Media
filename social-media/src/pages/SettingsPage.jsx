import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { userAPI } from "../services/api";
import { User, Lock, Bell, Shield, Camera, Check, AlertCircle } from "lucide-react";

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

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'password':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-500 mb-8">Update your password to keep your account secure</p>

            <form className="space-y-6 max-w-lg" onSubmit={handlePasswordSave}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordInputs.currentPassword} 
                  onChange={handlePasswordChange} 
                  className="input"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordInputs.newPassword} 
                  onChange={handlePasswordChange} 
                  className="input"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordInputs.confirmPassword} 
                  onChange={handlePasswordChange} 
                  className="input"
                  placeholder="Confirm new password"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn-primary w-full sm:w-auto"
              >
                {status === 'loading' ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
            <p className="text-gray-500 mb-8">Manage how you receive notifications</p>

            <div className="space-y-4 max-w-lg">
              {[
                { label: 'Likes', desc: 'When someone likes your post' },
                { label: 'Comments', desc: 'When someone comments on your post' },
                { label: 'New Followers', desc: 'When someone follows you' },
                { label: 'Direct Messages', desc: 'When you receive a new message' },
                { label: 'Mentions', desc: 'When someone mentions you' },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-indigo-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Security</h2>
            <p className="text-gray-500 mb-8">Control your account privacy settings</p>

            <div className="space-y-4 max-w-lg">
              {[
                { label: 'Private Account', desc: 'Only followers can see your posts', checked: false },
                { label: 'Activity Status', desc: 'Show when you\'re active', checked: true },
                { label: 'Allow Tagging', desc: 'Let others tag you in posts', checked: true },
                { label: 'Show Online Status', desc: 'Let others see when you\'re online', checked: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-indigo-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 p-4 bg-red-50 rounded-xl max-w-lg">
              <h3 className="font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back.</p>
              <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h2>
            <p className="text-gray-500 mb-8">Update your profile information</p>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-2xl max-w-lg">
              <div className="relative">
                <div className="avatar-ring">
                  <img 
                    src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                    className="w-20 h-20 rounded-full object-cover" 
                    alt=""
                  />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 gradient-bg rounded-full flex items-center justify-center shadow-lg">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              <div>
                <p className="font-bold text-gray-900">{currentUser?.username}</p>
                <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
                  Change Profile Photo
                </button>
              </div>
            </div>

            <form className="space-y-6 max-w-lg" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={inputs.username} 
                  onChange={handleChange} 
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={inputs.email} 
                  onChange={handleChange} 
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea 
                  name="bio"
                  value={inputs.bio}
                  onChange={handleChange}
                  rows="4"
                  className="input resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-400 mt-1">{inputs.bio.length}/150</p>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn-primary w-full sm:w-auto"
              >
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="card-flat p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === tab.id
                        ? 'gradient-bg text-white shadow-lg shadow-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 card-flat p-6 md:p-8">
            {/* Status Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn ${
                status === 'error' 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                {status === 'error' ? (
                  <AlertCircle size={20} />
                ) : (
                  <Check size={20} />
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
