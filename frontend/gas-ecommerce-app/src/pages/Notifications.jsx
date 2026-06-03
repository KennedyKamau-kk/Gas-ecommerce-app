// Notifications.jsx
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { markAsRead, deleteNotification } from "../api/notificationsApi";
import { Link } from "react-router-dom";
import { FaBell, FaCheckCircle, FaArrowLeft, FaTrash } from "react-icons/fa";

export default function Notifications() {
  const { notifications, fetchNotifications, unreadCount, loading } = useContext(NotificationContext);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(id);
        await fetchNotifications();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL notifications?")) {
      try {
        for (const notification of notifications) {
          await deleteNotification(notification.id);
        }
        await fetchNotifications();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="text-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading notifications...</p>
          </div>
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
                <FaBell className="text-2xl sm:text-3xl text-red-600" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">Notifications</h1>
              </div>
              <div className="w-16 sm:w-20 h-1 bg-red-600 mt-2"></div>
              <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Action Buttons - Stack on mobile, row on tablet+ */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm"
                >
                  <FaCheckCircle className="text-xs sm:text-sm" />
                  Mark All Read
                </button>
              )}
              {notifications && notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm"
                >
                  <FaTrash className="text-xs sm:text-sm" />
                  Delete All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications && notifications.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <FaBell className="text-5xl sm:text-6xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-200 text-base sm:text-lg mb-4">No notifications yet</p>
            <p className="text-gray-100 text-xs sm:text-sm">When you have notifications, they will appear here</p>
            <Link 
              to="/" 
              className="inline-block mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1
                  ${notification.is_read 
                    ? 'bg-linear-to-br from-gray-900 to-black border border-gray-800 opacity-75' 
                    : 'bg-linear-to-br from-gray-900 to-black border-l-4 border-l-red-600 border border-gray-800 shadow-lg'
                  }
                `}
              >
                <div className="p-3 sm:p-5">
                  {/* Stacked layout on mobile, row on tablet+ */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        {/* Unread Indicator */}
                        {!notification.is_read && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 bg-red-600 rounded-full animate-pulse shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`
                            text-sm sm:text-base font-medium leading-relaxed
                            ${notification.is_read ? 'text-gray-400' : 'text-white'}
                          `}>
                            {notification.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2">
                            <small className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                            {notification.is_read && (
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <FaCheckCircle className="text-xs" />
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Full width on mobile, inline on tablet+ */}
                    <div className="flex gap-2 sm:justify-end">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleRead(notification.id)}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1"
                      >
                        <FaTrash className="text-xs" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}