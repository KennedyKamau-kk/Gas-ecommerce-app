import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/authApi";
import { getOrders } from "../api/orderApi";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    address: ""
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const userData = response.data;
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        address: userData.address || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUserProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      
      // Update local storage user data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.error || "Failed to update profile" 
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-gray-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-red-600 transition-colors duration-300 mb-3 sm:mb-4 group text-sm sm:text-base"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-xs sm:text-sm" />
            Back to Home
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <FaUser className="text-2xl sm:text-3xl text-red-600" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">My Profile</h1>
              </div>
              <div className="w-16 sm:w-20 h-1 bg-red-600 mt-2"></div>
              <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">
                View and manage your account information
              </p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                <FaEdit className="text-sm sm:text-base" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${
            message.type === "success" 
              ? "bg-green-600/10 border border-green-600 text-green-500" 
              : "bg-red-600/10 border border-red-600 text-red-500"
          }`}>
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
              ) : (
                <FaTimesCircle className="text-red-500 text-sm sm:text-base" />
              )}
              <p className="font-semibold text-xs sm:text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              
              {/* Profile Picture Section - Optimized for mobile */}
              <div className="flex flex-col items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-800">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl text-white font-bold">
                      {formData.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  {isEditing && (
                    <span className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300">
                      <FaEdit className="text-white text-xs sm:text-sm" />
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-2 sm:mt-3">
                  {formData.first_name || formData.username || "User"}
                </h2>
              </div>

              {/* Form Fields - Single column on mobile, 2 columns on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Username */}
                <div>
                  <label className="block text-gray-300 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">
                    Username *
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300 text-sm sm:text-base" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Username"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">
                    Email *
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300 text-sm sm:text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Email address"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-300 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300 text-sm sm:text-base" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                {/* Address - Changed back to input type text */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">
                    Address
                  </label>
                  <div className="relative group">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300 text-sm sm:text-base" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Your address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions - Stack on mobile, row on desktop */}
            {isEditing && (
              <div className="bg-black/50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserProfile();
                  }}
                  className="px-4 sm:px-6 py-2 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm sm:text-base" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Danger Zone - Optimized for mobile */}
        <div className="mt-6 sm:mt-8 bg-linear-to-br from-black to-red-900/10 rounded-xl border border-red-600/30 p-4 sm:p-6">
          <h3 className="text-red-600 font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Permanently delete your account and all data</p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
                alert("Account deletion requested");
              }
            }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}