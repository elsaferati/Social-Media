import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to your Backend
      const res = await fetch("http://localhost:8800/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.user); // Save user to context
      navigate("/"); // Go to Home
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" onChange={handleChange} className="border p-2 rounded" required />
          <input type="password" placeholder="Password" name="password" onChange={handleChange} className="border p-2 rounded" required />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button className="bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;