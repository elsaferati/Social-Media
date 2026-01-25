import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

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
      {/* Left - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-[16px] flex items-center justify-center mb-8">
            <span className="text-3xl font-bold">S</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center tracking-tight">Welcome to Socialix</h1>
          <p className="text-lg text-white/80 text-center max-w-md">
            Connect with friends, share moments, and discover amazing content.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-14 h-14 gradient-bg rounded-[14px] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Welcome back</h2>
            <p className="text-[#64748B]">Sign in to continue to Socialix</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={inputs.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-[12px] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#7E22CE] focus:ring-4 focus:ring-[#F3E8FF] outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-white border border-[#E2E8F0] rounded-[12px] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#7E22CE] focus:ring-4 focus:ring-[#F3E8FF] outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {err && (
              <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] animate-fadeIn">
                <p className="text-[#DC2626] text-sm text-center">{err}</p>
              </div>
            )}

            <div className="text-right">
              <Link to="#" className="text-sm text-[#7E22CE] hover:text-[#6B21A8] font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
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

          <p className="text-center mt-8 text-[#64748B]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#7E22CE] font-semibold hover:text-[#6B21A8]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
