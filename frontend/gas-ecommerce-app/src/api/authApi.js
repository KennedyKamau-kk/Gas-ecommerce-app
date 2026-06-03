import privateApi from "./privateApi";

export const registerUser = (data) => privateApi.post("register/", data);
export const loginUser = (data) => privateApi.post("login/", data);
export const getUserProfile = () => privateApi.get("profile/");
export const updateUserProfile = (data) => privateApi.put("profile/", data);
export const updateUserProfilePartial = (data) => privateApi.patch("profile/", data);