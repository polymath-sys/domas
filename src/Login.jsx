import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard"); // Navigate to dashboard
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back!
        </h2>

        {error && (
          <p className="text-red-500 text-center bg-red-100 p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          {/* Email Field */}
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-gray-400" size={22} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-4 border rounded-lg focus:ring-4 focus:ring-indigo-300 transition"
              required
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-gray-400" size={22} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 p-4 border rounded-lg focus:ring-4 focus:ring-indigo-300 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-500 hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
