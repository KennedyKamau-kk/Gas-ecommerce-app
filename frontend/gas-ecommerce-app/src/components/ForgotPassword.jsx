import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useResetPassword';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaFire, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { sendResetLink, loading, error, success } = useForgotPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        await sendResetLink(email);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full space-y-8">
                    {/* Success Icon */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-600 rounded-full p-3 animate-bounce">
                                <FaCheckCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Check Your Email</h2>
                        <div className="w-20 h-1 bg-green-600 mx-auto"></div>
                        <p className="text-gray-400 mt-4">
                            We've sent a password reset link to <strong className="text-white">{email}</strong>
                        </p>
                        <p className="text-gray-500 text-sm mt-3">
                            Click the link in the email to reset your password. 
                            The link will expire in 24 hours.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link 
                            to="/login" 
                            className="flex-1 text-center px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold"
                        >
                            Back to Login
                        </Link>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                        >
                            Send Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto mt-2"></div>
                    <p className="text-gray-400 mt-4">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Forgot Password Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-gray-300 mb-2 font-semibold">
                            Email Address
                        </label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                                disabled={loading}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    error 
                                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50' 
                                        : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                                }`}
                            />
                        </div>
                        {error && (
                            <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                                <span className="text-xs"><FaExclamationTriangle /></span>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="relative w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                        disabled={loading}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </span>
                        <span className="absolute inset-0 bg-linear-to-r from-red-700 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </button>

                    {/* Back to Login Link */}
                    <div className="text-center">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 transition-all duration-300 group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Login
                        </Link>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                    <p className="text-xs text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="text-white hover:text-red-500 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;