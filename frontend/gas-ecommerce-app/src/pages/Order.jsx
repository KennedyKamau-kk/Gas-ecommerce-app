import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaBoxOpen, FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaFire } from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          bg: "bg-green-600/10",
          text: "text-green-500",
          border: "border-green-600/30",
          label: "Paid"
        };
      case "pending":
        return {
          icon: <FaClock className="text-yellow-500" />,
          bg: "bg-yellow-600/10",
          text: "text-yellow-500",
          border: "border-yellow-600/30",
          label: "Pending"
        };
      case "cancelled":
        return {
          icon: <FaTimesCircle className="text-red-500" />,
          bg: "bg-red-600/10",
          text: "text-red-500",
          border: "border-red-600/30",
          label: "Cancelled"
        };
      default:
        return {
          icon: <FaBoxOpen className="text-gray-500" />,
          bg: "bg-gray-600/10",
          text: "text-gray-500",
          border: "border-gray-600/30",
          label: status
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-gray-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">My Orders</h1>
              <div className="w-16 sm:w-20 h-1 bg-red-600"></div>
              <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            <FaShoppingBag className="text-3xl sm:text-4xl text-gray-700" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <FaBoxOpen className="text-5xl sm:text-6xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-100 text-base sm:text-lg mb-6">No orders found</p>
            <Link 
              to="/" 
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;
              
              return (
                <div 
                  key={order.id} 
                  className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div 
                    className="p-4 sm:p-6 cursor-pointer" 
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Left side - Icon and Order Info */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/10 rounded-lg flex items-center justify-center shrink-0">
                          <FaFire className="text-red-600 text-base sm:text-xl" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base sm:text-lg font-bold text-white truncate">
                            Order #{order.id}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4">
                        {/* Status Badge */}
                        <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          <span className="text-xs sm:text-sm">{statusConfig.icon}</span>
                          <span className="text-xs sm:text-sm font-semibold">{statusConfig.label}</span>
                        </div>
                        
                        {/* Total Amount */}
                        <div className="text-right">
                          <p className="text-sm sm:text-2xl font-bold text-white">
                            KSh {parseFloat(order.total_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 hidden sm:block">Total amount</p>
                        </div>
                        
                        {/* Expand Icon */}
                        <button className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300 shrink-0">
                          <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 bg-black/30 p-4 sm:p-6">
                      {/* Order Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
                        <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">Order Date</p>
                          <p className="text-white font-semibold text-sm sm:text-base">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
                          <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                          <p className="text-white font-semibold text-sm sm:text-base">M-Pesa</p>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                          <p className="text-xs text-gray-500 mb-1">Order Status</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base">{statusConfig.icon}</span>
                            <p className="text-white font-semibold text-sm sm:text-base">{statusConfig.label}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <FaBoxOpen className="text-red-600 text-sm sm:text-base" />
                          Order Items
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex gap-3 p-3 sm:p-4 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-all duration-300"
                            >
                              <img
                                src={item.product.image || "https://via.placeholder.com/60"}
                                alt={item.product.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/60?text=Gas";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base font-semibold text-white truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 sm:hidden">
                                  @ KSh {parseFloat(item.product.price).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm sm:text-base font-bold text-white">
                                  KSh {(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                  @ KSh {parseFloat(item.product.price).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-800">
                        <div className="flex justify-end">
                          <div className="w-full sm:w-80 space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                              <span>Subtotal</span>
                              <span>KSh {parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                              <span>Delivery Fee</span>
                              <span className="text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between pt-1.5 sm:pt-2 border-t border-gray-800">
                              <span className="text-base sm:text-lg font-bold text-white">Grand Total</span>
                              <span className="text-lg sm:text-xl font-bold text-white">
                                KSh {(parseFloat(order.total_amount)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                        {order.status === "pending" && (
                          <button className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 font-semibold text-sm sm:text-base">
                            Cancel Order
                          </button>
                        )}
                        {order.status === "paid" && (
                          <button className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-sm sm:text-base">
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}