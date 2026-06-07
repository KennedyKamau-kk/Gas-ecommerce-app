import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    password2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    setIsLoading(true);
    try {
      await registerUser(form);
      setErrors({ success: "Registration successful! Redirecting to login..." });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-400">Join GasMarket today</p>
        </div>

        {/* Error Messages Section */}
        {errors.general && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-400 shrink-0" />
            <p className="text-red-200 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Success Message */}
        {errors.success && (
          <div className="bg-green-900/50 border border-green-600 rounded-lg p-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-200 text-sm">{errors.success}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <div className="relative group">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={form.username}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.username 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: null });
                  }}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative group">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="relative group">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={form.phone_number}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.phone_number 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, phone_number: e.target.value });
                    if (errors.phone_number) setErrors({ ...errors, phone_number: null });
                  }}
                />
              </div>
              {errors.phone_number && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={form.address}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.address 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: null });
                  }}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={form.password}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                    if (errors.password2) setErrors({ ...errors, password2: null });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={form.password2}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password2 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                  onChange={(e) => {
                    setForm({ ...form, password2: e.target.value });
                    if (errors.password2) setErrors({ ...errors, password2: null });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password2 && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.password2}
                </p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Account...
                  </>
                </div>
              ) : (
                "Create Account"
              )}
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-red-700 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:font-semibold hover:underline transition-all duration-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}