import { useState, useContext, useEffect } from "react";
import { checkout, getOrder } from "../api/orderApi";
import { CartContext } from "../context/CartContext";
import { getCart } from "../api/cartApi";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaLock, FaCheckCircle, FaPhone, FaFire, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";

export default function Checkout() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    loadCartItems();
  }, []);

  // Poll for payment status
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getOrder(orderId);
        const status = res.data.status;
        setPaymentStatus(status);

        if (status === "paid") {
          setMessageType("success");
          setMessage("Payment successful! Redirecting to orders...");
          clearInterval(interval);
          await fetchCart(); // Clear cart badge after successful payment
          
          setTimeout(() => {
            window.location.href = "/orders";
          }, 2000);
        }

        if (status === "failed") {
          setMessageType("error");
          setMessage("Payment failed. Please try again.");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setMessageType("error");
        setMessage("Error checking payment status");
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, fetchCart]);

  const loadCartItems = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.items || []);
      const totalAmount = res.data.items?.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");
    setPaymentStatus("");

    try{
      const res = await checkout(phoneNumber);
      setOrderId(res.data.order_id);
      setMessageType("info");
      setMessage("M-Pesa prompt sent! Waiting for payment confirmation...");
      console.log(res.data);
    } catch(error) {
      console.error(error);
      setMessageType("error");
      setMessage(error.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-red-600 transition-colors duration-300 mb-3 sm:mb-4 group text-sm sm:text-base"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-xs sm:text-sm" />
            Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">Checkout</h1>
              <div className="w-16 sm:w-20 h-1 bg-red-600"></div>
              <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">Complete your purchase securely</p>
            </div>
            <FaMoneyBillWave className="text-4xl sm:text-5xl text-gray-700" />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 sticky top-24 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <FaFire className="text-red-600 text-base sm:text-xl" />
                Order Summary
              </h2>
              
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2 sm:p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <img 
                      src={item.product.image || "https://via.placeholder.com/80"} 
                      alt={item.product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Gas";
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                        Qty: {item.quantity}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 mt-1 sm:mt-2">
                        <p className="text-xs sm:text-sm font-bold text-white">
                          KSh {item.product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Total: KSh {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Subtotal</span>
                  <span className="text-sm sm:text-base text-white">KSh {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Delivery Fee</span>
                  <span className="text-xs sm:text-sm text-green-500">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-gray-800">
                  <span className="text-base sm:text-xl font-bold text-white">Total</span>
                  <span className="text-lg sm:text-2xl font-bold text-white">
                    KSh {(total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FaMobileAlt className="text-green-500 text-xl sm:text-2xl" />
                M-Pesa Payment
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-gray-300 mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300 text-sm sm:text-base" />
                    <input
                      type="tel"
                      placeholder="07XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300 text-sm sm:text-base"
                      required
                      disabled={!!orderId}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                    Enter your M-Pesa registered phone number
                  </p>
                </div>

                {/* Payment Details Info */}
                <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-800">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                      <FaMoneyBillWave className="text-green-500 text-base sm:text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">How to pay with M-Pesa</p>
                      <p className="text-xs text-gray-400">You'll receive a prompt on your phone</p>
                    </div>
                  </div>
                  <ol className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400 ml-4 sm:ml-5 list-decimal">
                    <li>Enter your M-Pesa registered phone number</li>
                    <li>Click "Pay with M-Pesa" button</li>
                    <li>Check your phone for STK Push prompt</li>
                    <li>Enter your M-Pesa PIN to complete payment</li>
                    <li>Wait for confirmation</li>
                  </ol>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0 || !!orderId}
                  className="relative w-full py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group text-sm sm:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave className="text-base sm:text-xl" />
                        Pay KSh {(total).toLocaleString()} with M-Pesa
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-green-700 to-green-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
              </form>

              {/* Payment Status Indicator */}
              {paymentStatus && paymentStatus !== "paid" && paymentStatus !== "failed" && (
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-500/10 border border-blue-500 rounded-lg">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-500"></div>
                    <span className="text-blue-400 font-semibold text-xs sm:text-sm">
                      Payment Status: {paymentStatus}...
                    </span>
                  </div>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg animate-slideDown ${
                  messageType === "success" 
                    ? "bg-green-600/10 border border-green-600" 
                    : messageType === "error"
                    ? "bg-red-600/10 border border-red-600"
                    : "bg-blue-600/10 border border-blue-600"
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {messageType === "success" ? (
                      <FaCheckCircle className="text-green-500 text-base sm:text-xl shrink-0" />
                    ) : messageType === "error" ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shrink-0">!</div>
                    ) : (
                      <div className="animate-pulse w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full shrink-0"></div>
                    )}
                    <p className={`font-semibold text-xs sm:text-sm ${
                      messageType === "success" ? "text-green-500" : 
                      messageType === "error" ? "text-red-500" : "text-blue-500"
                    }`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-800 text-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                  <FaLock className="text-green-500 text-xs sm:text-sm" />
                  <span>Secure payment powered by M-Pesa</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 sm:mt-2">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}