import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); // <-- added mobile
  const [wing, setWing] = useState("");
  const [apartment, setApartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "user", user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        mobile, // <-- added to Firestore
        wing,
        apartment,
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Create an Account</h2>

        {error && (
          <p className="text-red-500 text-center bg-red-100 p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name */}
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition"
            required
          />

          {/* Mobile Number */}
          <input
            type="tel"
            placeholder="Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
            className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition"
            required
          />

          {/* Wing & Apartment */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={wing}
              onChange={(e) => setWing(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition"
              required
            >
              <option value="" disabled>Select Wing</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <input
              type="text"
              placeholder="Apartment Number"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-blue-300 transition pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
