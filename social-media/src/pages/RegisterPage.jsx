import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Username" name="username" onChange={handleChange} className="border p-2 rounded" />
          <input type="email" placeholder="Email" name="email" onChange={handleChange} className="border p-2 rounded" />
          <input type="password" placeholder="Password" name="password" onChange={handleChange} className="border p-2 rounded" />
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button onClick={handleClick} className="bg-blue-500 text-white p-2 rounded">Register</button>
        </form>
        <p className="mt-4 text-sm">
          Has account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;