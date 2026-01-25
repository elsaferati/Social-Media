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
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Change Password</h2>
            <p className="text-[#64748B] mb-6">Update your password to keep your account secure</p>

            <form className="space-y-5 max-w-md" onSubmit={handlePasswordSave}>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">Current Password</label>
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
                <label className="block text-sm font-medium text-[#334155] mb-2">New Password</label>
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
                <label className="block text-sm font-medium text-[#334155] mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordInputs.confirmPassword} 
                  onChange={handlePasswordChange} 
                  className="input"
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" disabled={status === 'loading'} className="btn-primary">
                {status === 'loading' ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Notifications</h2>
            <p className="text-[#64748B] mb-6">Manage how you receive notifications</p>

            <div className="space-y-3 max-w-md">
              {[
                { label: 'Likes', desc: 'When someone likes your post' },
                { label: 'Comments', desc: 'When someone comments on your post' },
                { label: 'New Followers', desc: 'When someone follows you' },
                { label: 'Direct Messages', desc: 'When you receive a new message' },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-[#1E293B]">{item.label}</p>
                    <p className="text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#CBD5E1] peer-checked:bg-[#7E22CE] rounded-full transition-colors"></div>
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
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Privacy & Security</h2>
            <p className="text-[#64748B] mb-6">Control your account privacy settings</p>

            <div className="space-y-3 max-w-md">
              {[
                { label: 'Private Account', desc: 'Only followers can see your posts', checked: false },
                { label: 'Activity Status', desc: 'Show when you\'re active', checked: true },
                { label: 'Allow Tagging', desc: 'Let others tag you in posts', checked: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-[#1E293B]">{item.label}</p>
                    <p className="text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#CBD5E1] peer-checked:bg-[#7E22CE] rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] max-w-md">
              <h3 className="font-medium text-[#DC2626] mb-1">Danger Zone</h3>
              <p className="text-sm text-[#EF4444] mb-3">Once you delete your account, there is no going back.</p>
              <button className="text-sm px-4 py-2 bg-[#FECACA] text-[#DC2626] font-medium rounded-[10px] hover:bg-[#FCA5A5] transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Edit Profile</h2>
            <p className="text-[#64748B] mb-6">Update your profile information</p>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] max-w-md">
              <div className="relative">
                <img 
                  src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                  className="w-16 h-16 rounded-full object-cover bg-[#E2E8F0]" 
                  alt=""
                />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-bg rounded-full flex items-center justify-center shadow-md">
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-[#1E293B]">{currentUser?.username}</p>
                <button className="text-[#7E22CE] text-sm font-medium hover:text-[#6B21A8]">
                  Change Photo
                </button>
              </div>
            </div>

            <form className="space-y-5 max-w-md" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={inputs.username} 
                  onChange={handleChange} 
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={inputs.email} 
                  onChange={handleChange} 
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-2">Bio</label>
                <textarea 
                  name="bio"
                  value={inputs.bio}
                  onChange={handleChange}
                  rows="3"
                  className="input resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button type="submit" disabled={status === 'loading'} className="btn-primary">
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-6 tracking-tight">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-56 flex-shrink-0">
            <div className="card p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage(''); }}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all text-left text-sm ${
                      activeTab === tab.id
                        ? 'bg-[#F3E8FF] text-[#7E22CE] font-semibold'
                        : 'text-[#475569] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#7E22CE] rounded-r-full" />
                    )}
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 card p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-[12px] flex items-center gap-3 animate-fadeIn ${
                status === 'error' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#D1FAE5] text-[#059669]'
              }`}>
                {status === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                <span className="font-medium text-sm">{message}</span>
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
