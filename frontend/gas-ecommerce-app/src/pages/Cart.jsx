import { useEffect, useState, useContext } from "react";
import { getCart, removeCartItem, increaseCartItem, decreaseCartItem } from "../api/cartApi";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaCreditCard, FaFire } from "react-icons/fa";

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
          <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const total = cart?.items.reduce((sum, item) => {
    return sum + (item.quantity * parseFloat(item.product.price));
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-500 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-700 font-semibold hover:text-red-600 transition-colors duration-300 mb-4 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">My Cart</h1>
              <div className="w-20 h-1 bg-red-600"></div>
            </div>
            <FaShoppingCart className="text-4xl text-gray-700" />
          </div>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <FaShoppingCart className="text-6xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-100 text-lg mb-6">Your cart is empty</p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 p-4 group"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="sm:w-32 h-32 bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            {item.product.name}
                          </h2>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors duration-300 self-start"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecrease(item.id)}
                              disabled={updatingItem === item.id}
                              className="w-8 h-8 bg-gray-800 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="text-white font-semibold min-w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrease(item.id)}
                              disabled={updatingItem === item.id}
                              className="w-8 h-8 bg-gray-800 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          {/* <p className="text-xl font-bold text-white">
                            KSh {parseFloat(item.product.price).toLocaleString()}
                          </p> */}
                          <p className="text-xl font-bold text-white">
                            KSh {(item.quantity * parseFloat(item.product.price)).toLocaleString()}
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
              <div className="sticky top-24 bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 pb-4 border-b border-gray-800">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  {/* <div className="flex justify-between text-gray-400">
                    <span>Tax (16%)</span>
                    <span>KSh {(total * 0.16).toLocaleString()}</span>
                  </div> */}
                </div>
                
                <div className="pt-4 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-white">
                      KSh {(total).toLocaleString()}
                    </span>
                  </div>
                  {/* <p className="text-xs text-gray-500 text-center">
                    Including VAT
                  </p> */}
                </div>
                
                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25"
                >
                  {/* <FaCreditCard /> */}
                  Proceed to Checkout
                </Link>
                
                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center mb-3">Secure payment methods</p>
                  <div className="flex justify-center gap-4">
                    {/* <div className="text-2xl">💳</div> */}
                    <div className="text-2xl">📱</div>
                    {/* <div className="text-2xl">🏦</div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products Section */}
        {cart && cart.items.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6">You might also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-linear-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-3 hover:border-red-600 transition-all duration-300">
                  <div className="bg-gray-800 h-24 rounded-lg mb-2 flex items-center justify-center">
                    <FaFire className="text-4xl text-gray-700" />
                  </div>
                  <p className="text-white text-sm font-semibold">Gas Product</p>
                  <p className="text-red-600 text-xs font-bold">KSh 2,500</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}