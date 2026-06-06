// src/services/authApi.js
import privateApi from "./privateApi";

export const registerUser = (data) => privateApi.post("register/", data);
export const loginUser = (data) => privateApi.post("login/", data);
export const getUserProfile = () => privateApi.get("profile/");
export const updateUserProfile = (data) => privateApi.put("profile/", data);
export const updateUserProfilePartial = (data) => privateApi.patch("profile/", data);
export const forgotPassword = (email) => privateApi.post("forgot-password/", { email });
export const validateResetToken = (token) => privateApi.get(`validate-token/${token}/`);
export const resetPassword = (token, new_password, confirm_password) => 
    privateApi.post(`reset-password/${token}/`, { new_password, confirm_password });