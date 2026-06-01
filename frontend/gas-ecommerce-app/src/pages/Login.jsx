import { useState, useContext } from "react";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaFire } from "react-icons/fa";

export default function Login() {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        try {
            const res = await loginUser(form);
            login(res.data); 

            let username = "";
        
            if (res.data && res.data.user) {
                username = res.data.user.username || res.data.user.email || "User";
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } else if (res.data && res.data.username) {
                username = res.data.username;
                localStorage.setItem("user", JSON.stringify({ username: res.data.username }));
            } else if (form.username) {
                // Use the username from the form input
                username = form.username;
                localStorage.setItem("user", JSON.stringify({ username: form.username }));
            } else {
                username = "User";
                localStorage.setItem("user", JSON.stringify({ username: "User" }));
            }
            
            alert("Login successful!");
            window.location.href = "/";
        } catch (error) {
            console.error("Login error:", error.response?.data);
            setError(error.response?.data?.error || "Incorrect password or username");
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
                            <FaFire className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-400">Sign in to your GasMarket account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-600/10 border-l-4 border-red-600 p-4 rounded-lg animate-shake">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 font-semibold">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username/Email */}
                        <div className="relative group">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                            <input 
                                type="text" 
                                placeholder="Username or Email" 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300"
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                required
                                className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-red-600 transition-colors duration-300">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                    >
                        <span className="relative z-10">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </span>
                        <span className="absolute inset-0 bg-linear-to-r from-red-700 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </button>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-white hover:text-white font-semibold hover:underline transition-all duration-300">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Features Section */}
                {/* <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="group">
                            <div className="text-red-600 text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">🔒</div>
                            <p className="text-xs text-gray-500">Secure Login</p>
                        </div>
                        <div className="group">
                            <div className="text-red-600 text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">⚡</div>
                            <p className="text-xs text-gray-500">Fast Access</p>
                        </div>
                        <div className="group">
                            <div className="text-red-600 text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                            <p className="text-xs text-gray-500">Protected</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}