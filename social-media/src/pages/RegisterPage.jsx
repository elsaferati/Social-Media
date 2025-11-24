import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook } from "lucide-react"; 

const RegisterPage = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8800/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      navigate("/login");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Main Register Card */}
      <div className="bg-white border border-gray-300 w-full max-w-[350px] p-8 flex flex-col items-center mb-3">
        {/* Logo */}
        <h1 className="text-4xl font-bold font-[cursive] mb-4 mt-2">My Social App</h1>
        <p className="text-gray-500 font-semibold text-center mb-5 text-base leading-5">
            Sign up to see photos and videos from your friends.
        </p>

        {/* Big Social Button */}
        <button className="bg-[#0095f6] text-white text-sm font-semibold w-full py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition">
             <Facebook size={18} fill="white" /> Log in with Facebook
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-5">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="px-4 text-xs font-semibold text-gray-500">OR</span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>
        
        <form className="flex flex-col gap-2 w-full">
          <input 
            type="email" 
            placeholder="Mobile Number or Email" 
            name="email" 
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
          />
          <input 
            type="text" 
            placeholder="Username" 
            name="username" 
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
          />
          
          <p className="text-xs text-gray-500 text-center my-2 leading-4">
             People who use our service may have uploaded your contact information to Instagram.
          </p>

          {err && <p className="text-red-500 text-xs text-center">{err}</p>}
          
          <button onClick={handleClick} className="bg-[#0095f6] text-white text-sm font-semibold py-1.5 rounded-lg mt-2 hover:bg-blue-600 transition">
            Sign up
          </button>
        </form>
      </div>

      {/* Login Link Container */}
      <div className="bg-white border border-gray-300 w-full max-w-[350px] p-5 text-center text-sm">
        <p>
          Have an account? <Link to="/login" className="text-[#0095f6] font-semibold ml-1">Log in</Link>
        </p>
      </div>
      
      {/* App Store Badges (Visual only) */}
      <div className="mt-5 text-center">
          <p className="text-sm text-gray-600 mb-3">Get the app.</p>
          <div className="flex gap-2 justify-center">
             <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                Google Play
             </div>
             <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                Microsoft
             </div>
          </div>
      </div>
    </div>
  );
};

export default RegisterPage;