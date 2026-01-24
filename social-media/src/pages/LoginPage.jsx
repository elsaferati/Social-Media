import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Facebook } from "lucide-react";

const LoginPage = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null); // Clear error on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    
    try {
      const data = await authAPI.login(inputs.email, inputs.password);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Main Login Card */}
      <div className="bg-white border border-gray-300 w-full max-w-[350px] p-8 flex flex-col items-center mb-3">
        {/* Logo */}
        <h1 className="text-4xl font-bold font-[cursive] mb-8 mt-2">My Social App</h1>
        
        <form className="flex flex-col gap-2 w-full" onSubmit={handleLogin}>
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
            type="password" 
            placeholder="Password" 
            name="password" 
            value={inputs.password}
            onChange={handleChange} 
            className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-gray-400 w-full" 
            required 
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#0095f6] text-white text-sm font-semibold py-2 rounded-lg mt-2 hover:bg-blue-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        
          {err && <p className="text-red-500 text-xs text-center mt-2">{err}</p>}
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-5">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="px-4 text-xs font-semibold text-gray-500">OR</span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

        {/* Social Login */}
        <div className="flex flex-col items-center gap-4 w-full">
            <button className="flex items-center gap-2 text-[#385185] font-semibold text-sm hover:text-blue-700">
                <Facebook size={20} />
                Log in with Facebook
            </button>
            <span className="text-xs text-[#00376b] cursor-pointer hover:underline">Forgot password?</span>
        </div>
      </div>

      {/* Sign Up Link Container */}
      <div className="bg-white border border-gray-300 w-full max-w-[350px] p-5 text-center text-sm">
        <p>
          Don't have an account? <Link to="/register" className="text-[#0095f6] font-semibold ml-1 hover:underline">Sign up</Link>
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

export default LoginPage;
