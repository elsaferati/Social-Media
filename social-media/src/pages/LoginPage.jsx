import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
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
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background with Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center">Welcome to Socialix</h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Connect with friends, share moments, and discover amazing content from around the world.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-12 justify-center">
            {['Share Stories', 'Connect Friends', 'Discover Content', 'Stay Updated'].map((feature, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to continue to Socialix</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={inputs.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error Message */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-scaleIn">
                <p className="text-red-600 text-sm text-center">{err}</p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Google', icon: '🔵' },
              { name: 'Apple', icon: '🍎' },
              { name: 'Facebook', icon: '📘' }
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <span className="text-xl">{provider.icon}</span>
              </button>
            ))}
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
