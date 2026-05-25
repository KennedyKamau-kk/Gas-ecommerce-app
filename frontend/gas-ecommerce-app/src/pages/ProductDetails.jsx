import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft, FaCheckCircle, FaFire, FaGasPump, FaTruck, FaShieldAlt } from "react-icons/fa";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      await fetchCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <FaGasPump className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Product not found</p>
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors duration-300 mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnail Gallery (Optional) */}
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-800 rounded-lg border-2 border-red-600 overflow-hidden">
                <img src={product.image} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="w-20 h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-red-600 transition-colors duration-300">
                <img src={product.image} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="w-20 h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-red-600 transition-colors duration-300 flex items-center justify-center">
                <FaGasPump className="text-gray-600 text-3xl" />
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.stock > 10 
                  ? "bg-green-600/10 text-green-500 border border-green-600/30" 
                  : product.stock > 0 
                  ? "bg-yellow-600/10 text-yellow-500 border border-yellow-600/30" 
                  : "bg-red-600/10 text-red-500 border border-red-600/30"
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
              {product.featured && (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-600/10 text-red-500 border border-red-600/30 rounded-full text-sm font-semibold">
                  <FaFire className="text-xs" />
                  Featured
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Product Description */}
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-red-600">
                KSh {parseFloat(product.price).toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through">
                  KSh {parseFloat(product.originalPrice).toLocaleString()}
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-gray-300 font-semibold">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-800 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-white text-xl font-semibold min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock <= quantity}
                  className="w-10 h-10 bg-gray-800 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-gray-500 text-sm ml-2">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="relative w-full py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {addedToCart ? (
                  <>
                    <FaCheckCircle className="animate-bounce" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Add to Cart - KSh {(parseFloat(product.price) * quantity).toLocaleString()}
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </button>

            {/* Features Section */}
            <div className="pt-6 mt-6 border-t border-gray-800">
              <h3 className="text-white font-semibold mb-4">Product Features:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaFire className="text-red-600" />
                  <span>High Purity</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaShieldAlt className="text-red-600" />
                  <span>Safety Certified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaTruck className="text-red-600" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaGasPump className="text-red-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-start gap-3">
                <FaTruck className="text-red-600 text-xl mt-1" />
                <div>
                  <p className="text-white font-semibold">Free Delivery</p>
                  <p className="text-gray-500 text-sm">Orders above KSh 5,000 qualify for free delivery within Nairobi</p>
                  <p className="text-gray-600 text-xs mt-2">Estimated delivery: 2-3 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (Optional) */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-3 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="bg-gray-800 h-32 rounded-lg mb-2 flex items-center justify-center">
                  <FaGasPump className="text-4xl text-gray-700" />
                </div>
                <p className="text-white text-sm font-semibold">Gas Cylinder {i}kg</p>
                <p className="text-red-600 text-xs font-bold">KSh {2500 * i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}