import { createContext, useEffect, useState } from "react";
import { getNotifications } from "../api/notificationsApi";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
    return !!token;
  };

  const fetchNotifications = async () => {
    //Only fetch if user is authenticated
    const token = checkAuth();
    
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      
      // If 401 error, clear token and mark as unauthenticated
      if (error.response?.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check auth and fetch when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for login/logout events (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
      fetchNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const unreadCount = notifications?.filter(notification => !notification.is_read).length || 0;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        loading,
        isAuthenticated
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};