import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";

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
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { level: 2, text: 'Good', color: 'bg-yellow-500' };
    return { level: 3, text: 'Strong', color: 'bg-green-500' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-40 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center">Join Socialix</h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Create your account and start connecting with people around the world.
          </p>
          
          {/* Benefits List */}
          <div className="mt-12 space-y-4">
            {[
              'Free forever, no hidden charges',
              'Connect with millions of users',
              'Share unlimited photos & videos',
              'Privacy focused & secure'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-500">Start your journey with Socialix</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={inputs.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

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
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
              
              {/* Password Strength Indicator */}
              {inputs.password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          strength.level >= level ? strength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    strength.level === 1 ? 'text-red-500' :
                    strength.level === 2 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {strength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-scaleIn">
                <p className="text-red-600 text-sm text-center">{err}</p>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <Link to="#" className="text-indigo-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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

          {/* Sign In Link */}
          <p className="text-center mt-8 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
