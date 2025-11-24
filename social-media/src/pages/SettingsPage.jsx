import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const SettingsPage = () => {
  const { currentUser, updateUser } = useAuth();

  const [inputs, setInputs] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "", 
    bio: currentUser.bio || "", // Add bio field if you have it
  });

  const [status, setStatus] = useState(null); 
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`http://localhost:8800/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data);
      updateUser(data);
      setStatus("success");
      setMessage("Profile saved.");
      setInputs(prev => ({ ...prev, password: "" }));
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to update.");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[800px] bg-white border border-gray-200 rounded-lg flex overflow-hidden min-h-[500px] mt-4">
        
        {/* Left Sidebar (Settings Menu) */}
        <div className="w-1/4 border-r border-gray-200 hidden md:block">
            <div className="p-4 font-bold border-l-2 border-black">Edit Profile</div>
            <div className="p-4 text-gray-500 hover:bg-gray-50 cursor-pointer">Change Password</div>
            <div className="p-4 text-gray-500 hover:bg-gray-50 cursor-pointer">Push Notifications</div>
            <div className="p-4 text-gray-500 hover:bg-gray-50 cursor-pointer">Privacy and Security</div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">
            <h2 className="text-xl mb-6 md:hidden">Edit Profile</h2>

            <div className="flex items-center gap-6 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src={"https://i.pravatar.cc/150?u=" + currentUser.id} className="w-full h-full object-cover" alt=""/>
                </div>
                <div>
                    <div className="font-semibold text-lg leading-tight">{currentUser.username}</div>
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
                        className="border border-gray-300 rounded px-3 py-1.5 flex-1 focus:border-black outline-none" 
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
                        className="border border-gray-300 rounded px-3 py-1.5 flex-1 focus:border-black outline-none" 
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                    <label className="font-bold w-32 text-right hidden md:block">Bio</label>
                    <label className="font-bold md:hidden">Bio</label>
                    <textarea 
                        name="bio"
                        rows="2"
                        className="border border-gray-300 rounded px-3 py-1.5 flex-1 focus:border-black outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mt-4">
                     <div className="w-32 hidden md:block"></div> {/* Spacer */}
                     <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                     >
                        Submit
                     </button>
                </div>

                {message && (
                    <div className={`mt-4 text-center text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;