import { useEffect, useState, useContext } from "react";
import { getCart, removeCartItem, increaseCartItem, decreaseCartItem } from "../api/cartApi";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaFire } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrease = async (itemId) => {
    try {
      setUpdatingItem(itemId);
      await increaseCartItem(itemId);
      await loadCart();
      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleDecrease = async (itemId) => {
    try {
      setUpdatingItem(itemId);
      await decreaseCartItem(itemId);
      await loadCart();
      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-gray-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const total = cart?.items.reduce((sum, item) => {
    return sum + (item.quantity * parseFloat(item.product.price));
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-red-600 transition-colors duration-300 mb-3 sm:mb-4 group text-sm sm:text-base"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-xs sm:text-sm" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">My Cart</h1>
              <div className="w-16 sm:w-20 h-1 bg-red-600"></div>
            </div>
            <FaShoppingCart className="text-3xl sm:text-4xl text-gray-700" />
          </div>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <FaShoppingCart className="text-5xl sm:text-6xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-100 text-base sm:text-lg mb-6">Your cart is empty</p>
            <Link 
              to="/" 
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 p-3 sm:p-4 group"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                            {item.product.name}
                          </h2>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors duration-300 shrink-0"
                        >
                          <FaTrash className="text-xs sm:text-sm" />
                        </button>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 sm:hidden">
                        {item.product.description}
                      </p>
                      
                      <div className="mt-2 sm:mt-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-400 text-xs sm:text-sm">Qty:</span>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleDecrease(item.id)}
                              disabled={updatingItem === item.id}
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="text-white font-semibold min-w-6 sm:min-w-10 text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrease(item.id)}
                              disabled={updatingItem === item.id}
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm sm:text-base md:text-xl font-bold text-white">
                            KSh {(item.quantity * parseFloat(item.product.price)).toLocaleString()}
                          </p>
                          <p className="text-gray-500 text-xs sm:hidden">
                            @ KSh {parseFloat(item.product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Order Summary</h2>
                
                <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-gray-800">
                  <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 pb-4 sm:pb-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-semibold text-white">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-white">
                      KSh {(total).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}