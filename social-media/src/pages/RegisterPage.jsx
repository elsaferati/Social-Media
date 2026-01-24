import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook } from "lucide-react";
import { authAPI } from "../services/api";

const RegisterPage = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!inputs.username || !inputs.email || !inputs.password) {
      setErr("All fields are required");
      return;
    }

    if (inputs.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      await authAPI.register(inputs.username, inputs.email, inputs.password);
      navigate("/login");
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
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
        <button className="bg-[#0095f6] text-white text-sm font-semibold w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition">
             <Facebook size={18} fill="white" /> Log in with Facebook
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-5">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="px-4 text-xs font-semibold text-gray-500">OR</span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>
        
        <form className="flex flex-col gap-2 w-full" onSubmit={handleClick}>
          <input 
            type="email" 
            placeholder="Email address" 
            name="email"
            value={inputs.email}
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
            required
          />
          <input 
            type="text" 
            placeholder="Username" 
            name="username"
            value={inputs.username}
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            name="password"
            value={inputs.password}
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
            required
            minLength={6}
          />
          
          <p className="text-xs text-gray-500 text-center my-2 leading-4">
             By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>

          {err && <p className="text-red-500 text-xs text-center">{err}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#0095f6] text-white text-sm font-semibold py-2 rounded-lg mt-2 hover:bg-blue-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>

      {/* Login Link Container */}
      <div className="bg-white border border-gray-300 w-full max-w-[350px] p-5 text-center text-sm">
        <p>
          Have an account? <Link to="/login" className="text-[#0095f6] font-semibold ml-1 hover:underline">Log in</Link>
        </p>
      </div>
      
      {/* App Store Badges */}
      <div className="mt-5 text-center">
          <p className="text-sm text-gray-600 mb-3">Get the app.</p>
          <div className="flex gap-2 justify-center">
             <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-800">
                Google Play
             </div>
             <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-800">
                Microsoft
             </div>
          </div>
      </div>
    </div>
  );
};

export default RegisterPage;
