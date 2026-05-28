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
          <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">My Orders</h1>
              <div className="w-20 h-1 bg-red-600"></div>
              <p className="text-gray-700 font-semibold mt-2">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            <FaShoppingBag className="text-4xl text-gray-700" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <FaBoxOpen className="text-6xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-100 text-lg mb-6">No orders found</p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;
              
              return (
                <div 
                  key={order.id} 
                  className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center">
                          <FaFire className="text-red-600 text-xl" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            Order #{order.id}
                          </h2>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          {statusConfig.icon}
                          <span className="text-sm font-semibold">{statusConfig.label}</span>
                        </div>
                        
                        {/* Total Amount */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            KSh {parseFloat(order.total_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Total amount</p>
                        </div>
                        
                        {/* Expand Icon */}
                        <button className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300">
                          <svg className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 bg-black/30 p-6">
                      {/* Order Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-800/30 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Order Date</p>
                          <p className="text-white font-semibold">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                          <p className="text-white font-semibold">M-Pesa</p>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Order Status</p>
                          <div className="flex items-center gap-2">
                            {statusConfig.icon}
                            <p className="text-white font-semibold">{statusConfig.label}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FaBoxOpen className="text-red-600" />
                          Order Items
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-4 p-4 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-all duration-300"
                            >
                              <img
                                src={item.product.image || "https://via.placeholder.com/60"}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/60?text=Gas";
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-white">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-white">
                                  KSh {(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @ KSh {parseFloat(item.product.price).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t border-gray-800">
                        <div className="flex justify-end">
                          <div className="w-full sm:w-80 space-y-2">
                            <div className="flex justify-between text-gray-400">
                              <span>Subtotal</span>
                              <span>KSh {parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                              <span>Delivery Fee</span>
                              <span className="text-green-500">Free</span>
                            </div>
                            {/* <div className="flex justify-between text-gray-400">
                              <span>Tax (16%)</span>
                              <span>KSh {(parseFloat(order.total_amount) * 0.16).toLocaleString()}</span>
                            </div> */}
                            <div className="flex justify-between pt-2 border-t border-gray-800">
                              <span className="text-lg font-bold text-white">Grand Total</span>
                              <span className="text-xl font-bold text-white">
                                KSh {(parseFloat(order.total_amount)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-4 justify-end">
                        {/* <button className="px-4 py-2 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold">
                          <FaEye className="inline mr-2" />
                          View Details
                        </button> */}
                        {order.status === "pending" && (
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-300 font-semibold">
                            Cancel Order
                          </button>
                        )}
                        {order.status === "paid" && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold">
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