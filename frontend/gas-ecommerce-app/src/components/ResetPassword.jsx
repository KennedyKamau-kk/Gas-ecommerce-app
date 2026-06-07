import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPassword, useValidateToken } from '../hooks/useResetPassword';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    const { resetPassword, loading: resetLoading, error: resetError, success } = useResetPassword();
    const { validateToken, validating, isValid, email, error: tokenError } = useValidateToken();

    useEffect(() => {
        if (token) {
            validateToken(token);
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'new_password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        setPasswordStrength(strength);
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return '#ef4444';
        if (passwordStrength <= 4) return '#f59e0b';
        return '#10b981';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.confirm_password) {
            return;
        }
        
        const result = await resetPassword(token, formData.new_password, formData.confirm_password);
        
        if (result.success) {
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    };

    // Validating State
    if (validating) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid Token State
    if (!isValid) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-linear-to-br from-gray-900 to-black rounded-xl border border-red-600 p-8 text-center">
                    <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimesCircle className="text-5xl text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
                    <div className="w-16 h-0.5 bg-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400 mb-6">
                        {tokenError || 'This password reset link is invalid or has expired.'}
                    </p>
                    <Link 
                        to="/forgot-password" 
                        className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    // Success State
    if (success) {
        return (
            <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-linear-to-br from-gray-900 to-black rounded-xl border border-green-600 p-8 text-center">
                    <div className="w-20 h-20 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <FaCheckCircle className="text-5xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
                    <div className="w-16 h-0.5 bg-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-400 mb-2">Your password has been changed successfully.</p>
                    <p className="text-gray-500 text-sm mb-6">Redirecting to login page...</p>
                    <Link 
                        to="/login" 
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    // Main Reset Password Form
    return (
        <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600 rounded-full p-3 animate-pulse">
                            <FaShieldAlt className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create New Password</h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto mt-2"></div>
                    <p className="text-gray-400 mt-4">
                        Set a new password for <strong className="text-white">{email}</strong>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* New Password Field */}
                    <div>
                        <label htmlFor="new_password" className="block text-gray-300 mb-2 font-semibold">
                            New Password
                        </label>
                        <div className="relative group">
                            <input
                                id="new_password"
                                name="new_password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.new_password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                disabled={resetLoading}
                                className={`w-full pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    resetError 
                                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50' 
                                        : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                                }`}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.new_password && (
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500">Password strength:</span>
                                    <span className="text-xs font-semibold" style={{ color: getStrengthColor() }}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full transition-all duration-300 rounded-full"
                                        style={{
                                            width: `${(passwordStrength / 5) * 100}%`,
                                            backgroundColor: getStrengthColor()
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Password Requirements */}
                        <ul className="mt-3 space-y-1 text-xs">
                            <li className={`flex items-center gap-2 ${formData.new_password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                                <span>{formData.new_password.length >= 8 ? '✓' : '○'}</span>
                                At least 8 characters
                            </li>
                            <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-500'}`}>
                                <span>{/[a-z]/.test(formData.new_password) ? '✓' : '○'}</span>
                                Lowercase letter
                            </li>
                            <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-500'}`}>
                                <span>{/[A-Z]/.test(formData.new_password) ? '✓' : '○'}</span>
                                Uppercase letter
                            </li>
                            <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-500'}`}>
                                <span>{/[0-9]/.test(formData.new_password) ? '✓' : '○'}</span>
                                Number
                            </li>
                            <li className={`flex items-center gap-2 ${/[$@#&!]/.test(formData.new_password) ? 'text-green-500' : 'text-gray-500'}`}>
                                <span>{/[$@#&!]/.test(formData.new_password) ? '✓' : '○'}</span>
                                Special character ($@#&!)
                            </li>
                        </ul>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirm_password" className="block text-gray-300 mb-2 font-semibold">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                disabled={resetLoading}
                                className={`w-full pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.confirm_password && formData.new_password !== formData.confirm_password
                                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50'
                                        : 'border-gray-700 focus:border-red-600 focus:ring-red-600/50'
                                }`}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                        {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                            <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                                <span><FaExclamationTriangle /></span>
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    {/* Error Alert */}
                    {resetError && (
                        <div className="bg-red-600/10 border-l-4 border-red-600 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FaTimesCircle className="text-red-600" />
                                <p className="text-red-600 font-semibold">{resetError}</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="relative w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                        disabled={resetLoading || !formData.new_password || !formData.confirm_password || formData.new_password !== formData.confirm_password}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {resetLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
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
            </div>
        </div>
    );
};

export default ResetPassword;