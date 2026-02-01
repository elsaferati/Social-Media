import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { userAPI, authAPI, getAvatarUrl } from "../services/api";
import { User, Lock, Bell, Shield, Camera, Check, AlertCircle } from "lucide-react";

const NOTIFICATION_PREFS_KEY = 'socialix_notification_prefs';
const PRIVACY_PREFS_KEY = 'socialix_privacy_prefs';

const getStoredNotificationPrefs = (userId) => {
  if (!userId) return { likes: true, comments: true, newFollowers: true, directMessages: true };
  try {
    const raw = localStorage.getItem(`${NOTIFICATION_PREFS_KEY}_${userId}`);
    if (!raw) return { likes: true, comments: true, newFollowers: true, directMessages: true };
    const parsed = JSON.parse(raw);
    return { likes: true, comments: true, newFollowers: true, directMessages: true, ...parsed };
  } catch {
    return { likes: true, comments: true, newFollowers: true, directMessages: true };
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState(() =>
    getStoredNotificationPrefs(currentUser?.id)
  );

  const getStoredPrivacyPrefs = (userId) => {
    if (!userId) return { privateAccount: false, activityStatus: true, allowTagging: true };
    try {
      const raw = localStorage.getItem(`${PRIVACY_PREFS_KEY}_${userId}`);
      if (!raw) return { privateAccount: false, activityStatus: true, allowTagging: true };
      const parsed = JSON.parse(raw);
      return { privateAccount: false, activityStatus: true, allowTagging: true, ...parsed };
    } catch {
      return { privateAccount: false, activityStatus: true, allowTagging: true };
    }
  };

  const [privacyPrefs, setPrivacyPrefs] = useState(() =>
    getStoredPrivacyPrefs(currentUser?.id)
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

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

  useEffect(() => {
    setNotificationPrefs(getStoredNotificationPrefs(currentUser?.id));
  }, [currentUser?.id]);

  useEffect(() => {
    setPrivacyPrefs(getStoredPrivacyPrefs(currentUser?.id));
  }, [currentUser?.id]);

  const handlePrivacyToggle = (key) => {
    const next = { ...privacyPrefs, [key]: !privacyPrefs[key] };
    setPrivacyPrefs(next);
    if (currentUser?.id) {
      localStorage.setItem(`${PRIVACY_PREFS_KEY}_${currentUser.id}`, JSON.stringify(next));
    }
  };

  const handleNotificationToggle = (key) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(next);
    if (currentUser?.id) {
      localStorage.setItem(`${NOTIFICATION_PREFS_KEY}_${currentUser.id}`, JSON.stringify(next));
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setStatus('error');
      setMessage('Please choose a JPEG, PNG, GIF or WebP image.');
      return;
    }
    setUploadingPhoto(true);
    setMessage('');
    try {
      const data = await userAPI.updateProfilePic(currentUser.id, file);
      updateUser(data);
      setStatus('success');
      setMessage('Profile photo updated!');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
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
        const notificationItems = [
          { key: 'likes', label: 'Likes', desc: 'When someone likes your post' },
          { key: 'comments', label: 'Comments', desc: 'When someone comments on your post' },
          { key: 'newFollowers', label: 'New Followers', desc: 'When someone follows you' },
          { key: 'directMessages', label: 'Direct Messages', desc: 'When you receive a new message' },
        ];
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Notifications</h2>
            <p className="text-[#64748B] mb-6">Manage how you receive notifications</p>

            <div className="space-y-3 max-w-md">
              {notificationItems.map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-[#1E293B]">{item.label}</p>
                    <p className="text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationPrefs[item.key] ?? true}
                      onChange={() => handleNotificationToggle(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#CBD5E1] peer-checked:bg-[#7E22CE] rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        const privacyItems = [
          { key: 'privateAccount', label: 'Private Account', desc: 'Only followers can see your posts' },
          { key: 'activityStatus', label: 'Activity Status', desc: "Show when you're active" },
          { key: 'allowTagging', label: 'Allow Tagging', desc: 'Let others tag you in posts' },
        ];
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Privacy & Security</h2>
            <p className="text-[#64748B] mb-6">Control your account privacy settings</p>

            <div className="space-y-3 max-w-md">
              {privacyItems.map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-[#1E293B]">{item.label}</p>
                    <p className="text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={privacyPrefs[item.key] ?? (item.key === 'privateAccount' ? false : true)}
                      onChange={() => handlePrivacyToggle(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#CBD5E1] peer-checked:bg-[#7E22CE] rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] max-w-md">
              <h3 className="font-medium text-[#DC2626] mb-1">Danger Zone</h3>
              <p className="text-sm text-[#EF4444] mb-3">Once you delete your account, there is no going back.</p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-sm px-4 py-2 bg-[#FECACA] text-[#DC2626] font-medium rounded-[10px] hover:bg-[#FCA5A5] transition-colors"
              >
                Delete Account
              </button>
            </div>

            {/* Delete account modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deletingAccount && setShowDeleteModal(false)} />
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scaleIn p-6" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900">Delete account</h3>
                  <p className="mt-1 text-sm text-gray-600 mb-4">Enter your password to permanently delete your account. This cannot be undone.</p>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="input w-full mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                      disabled={deletingAccount}
                      className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-70"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!deletePassword.trim()) return;
                        setDeletingAccount(true);
                        try {
                          await authAPI.deleteAccount(deletePassword);
                          logout();
                          navigate('/login');
                        } catch (err) {
                          setStatus('error');
                          setMessage(err.message || 'Failed to delete account.');
                          setShowDeleteModal(false);
                          setDeletePassword('');
                        } finally {
                          setDeletingAccount(false);
                        }
                      }}
                      disabled={deletingAccount || !deletePassword.trim()}
                      className="px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-70"
                    >
                      {deletingAccount ? 'Deleting...' : 'Delete my account'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1E293B] mb-1 tracking-tight">Edit Profile</h2>
            <p className="text-[#64748B] mb-6">Update your profile information</p>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] max-w-md">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <div className="relative">
                <img 
                  src={getAvatarUrl(currentUser?.profilePic)} 
                  className="w-16 h-16 rounded-full object-cover bg-[#E2E8F0]" 
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 w-7 h-7 gradient-bg rounded-full flex items-center justify-center shadow-md disabled:opacity-70"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-[#1E293B]">{currentUser?.username}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="text-[#7E22CE] text-sm font-medium hover:text-[#6B21A8] disabled:opacity-70"
                >
                  {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
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
