import privateApi from "./privateApi";

export const getNotifications = async () => {
  // Check token before making request
  const token = localStorage.getItem("access");
  if (!token) {
    return { data: [] };
  }

  try {
    const response = await privateApi.get("notifications/");
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem("access");
  if (!token) {
    return null;
  }

  try {
    const response = await privateApi.patch(`notifications/${notificationId}/`);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem("access");
  if (!token) {
    return null;
  }

  try {
    const response = await privateApi.delete(`notifications/${notificationId}/`);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    throw error;
  }
};