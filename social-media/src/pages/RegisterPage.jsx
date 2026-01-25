import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";

const RegisterPage = () => {
  const [inputs, setInputs] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
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

  const passwordStrength = () => {
    const password = inputs.password;
    if (password.length === 0) return { level: 0, text: '', color: '' };
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-[#EF4444]' };
    if (password.length < 10) return { level: 2, text: 'Good', color: 'bg-[#F59E0B]' };
    return { level: 3, text: 'Strong', color: 'bg-[#10B981]' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-[16px] flex items-center justify-center mb-8">
            <span className="text-3xl font-bold">S</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center tracking-tight">Join Socialix</h1>
          <p className="text-lg text-white/80 text-center max-w-md">
            Create your account and start connecting with people around the world.
          </p>
          
          {/* Benefits */}
          <div className="mt-10 space-y-4">
            {[
              'Free forever, no hidden charges',
              'Connect with millions of users',
              'Share unlimited photos & videos',
              'Privacy focused & secure'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
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
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">Create account</h2>
            <p className="text-[#64748B]">Start your journey with Socialix</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={inputs.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-[12px] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#7E22CE] focus:ring-4 focus:ring-[#F3E8FF] outline-none transition-all"
                required
              />
            </div>

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

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
              
              {inputs.password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          strength.level >= level ? strength.color : 'bg-[#E2E8F0]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    strength.level === 1 ? 'text-[#EF4444]' :
                    strength.level === 2 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                  }`}>
                    {strength.text}
                  </span>
                </div>
              )}
            </div>

            {err && (
              <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] animate-fadeIn">
                <p className="text-[#DC2626] text-sm text-center">{err}</p>
              </div>
            )}

            <p className="text-xs text-[#64748B] text-center">
              By signing up, you agree to our{' '}
              <Link to="#" className="text-[#7E22CE] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="#" className="text-[#7E22CE] hover:underline">Privacy Policy</Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-[#64748B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7E22CE] font-semibold hover:text-[#6B21A8]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
