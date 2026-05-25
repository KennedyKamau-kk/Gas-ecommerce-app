import { useState, useContext, useEffect } from "react";
import { checkout } from "../api/orderApi";
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
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    loadCartItems();
  }, []);

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

    try{
      const res = await checkout(phoneNumber);
      setMessageType("success");
      setMessage("M-Pesa prompt sent! Check your phone for payment.");
      console.log(res.data);
      setTimeout(() => {
          window.location.href = "/orders";
      }, 3000);
    } catch(error) {
      console.error(error);
      setMessageType("error");
      setMessage(error.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-red-600 transition-colors duration-300 mb-4 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">Checkout</h1>
              <div className="w-20 h-1 bg-red-600"></div>
              <p className="text-gray-700 font-semibold mt-2">Complete your purchase securely</p>
            </div>
            <FaMoneyBillWave className="text-5xl text-gray-700" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaFire className="text-red-600" />
                Order Summary
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <img 
                      src={item.product.image || "https://via.placeholder.com/80"} 
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Gas";
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-bold text-white">
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
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">KSh {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-green-500">Free</span>
                </div>
                {/* <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Tax (16%)</span>
                  <span className="text-white">KSh {(total * 0.16).toLocaleString()}</span>
                </div> */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-800">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">
                    KSh {(total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaMobileAlt className="text-green-500 text-2xl" />
                M-Pesa Payment
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                    <input
                      type="tel"
                      placeholder="07XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the M-Pesa registered phone number
                  </p>
                </div>

                {/* Payment Details Info */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <FaMoneyBillWave className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">How to pay with M-Pesa</p>
                      <p className="text-xs text-gray-400">You'll receive a prompt on your phone</p>
                    </div>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-400 ml-4 list-decimal">
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
                  disabled={loading || cartItems.length === 0}
                  className="relative w-full py-4 bg-green-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave className="text-xl" />
                        Pay KSh {(total).toLocaleString()} with M-Pesa
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-green-700 to-green-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
              </form>

              {/* Message Display */}
              {message && (
                <div className={`mt-6 p-4 rounded-lg animate-slideDown ${
                  messageType === "success" 
                    ? "bg-green-600/10 border border-green-600" 
                    : "bg-red-600/10 border border-red-600"
                }`}>
                  <div className="flex items-center gap-3">
                    {messageType === "success" ? (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                    )}
                    <p className={`font-semibold ${
                      messageType === "success" ? "text-green-500" : "text-red-500"
                    }`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaLock className="text-green-500" />
                  <span>Secure payment powered by M-Pesa</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
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