import { useState } from 'react';
import { forgotPassword, validateResetToken, resetPassword } from '../api/authApi';

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const sendResetLink = async (email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await forgotPassword(email);
            setSuccess(true);
            return { success: true, message: response.data.message };
        } catch (err) {
            const errorMessage = err.response?.data?.email?.[0] || 
                                err.response?.data?.error || 
                                'Failed to send reset link. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { sendResetLink, loading, error, success };
};

export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const resetUserPassword = async (token, newPassword, confirmPassword) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await resetPassword(token, newPassword, confirmPassword);
            setSuccess(true);
            return { success: true, message: response.data.message };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 
                                err.response?.data?.new_password?.[0] ||
                                err.response?.data?.confirm_password?.[0] ||
                                'Failed to reset password. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { resetPassword: resetUserPassword, loading, error, success };
};

export const useValidateToken = () => {
    const [validating, setValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const validateToken = async (token) => {
        setValidating(true);
        setError(null);
        
        try {
            const response = await validateResetToken(token);
            setIsValid(response.data.valid);
            setEmail(response.data.email || '');
            return { isValid: response.data.valid, email: response.data.email };
        } catch (err) {
            setIsValid(false);
            const errorMessage = err.response?.data?.message || 'Invalid or expired reset link';
            setError(errorMessage);
            return { isValid: false, error: errorMessage };
        } finally {
            setValidating(false);
        }
    };

    return { validateToken, validating, isValid, email, error };
};