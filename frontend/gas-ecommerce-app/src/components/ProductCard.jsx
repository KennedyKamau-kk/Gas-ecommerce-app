import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaFire, FaCheckCircle } from "react-icons/fa";

export default function ProductCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div 
      className="group relative bg-linear-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-800 hover:border-red-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {/* {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
          -{product.discount}% OFF
        </div>
      )} */}
      
      {/* Stock Status Badge */}
      <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-lg text-xs font-bold ${
        product.stock > 10 
          ? "bg-green-600 text-white" 
          : product.stock > 0 
          ? "bg-yellow-600 text-white" 
          : "bg-red-600 text-white"
      }`}>
        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden h-56 bg-gray-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300">
            <Link to={`/products/${product.id}`}
              disabled={product.stock === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quick View
            </Link>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover: transition-colors duration-300">
          {product.name}
        </h2>
        
        {/* Product Description */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price and Original Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-sm font-bold text-white">
            KSh {product.price.toLocaleString()}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-white line-through">
              KSh {product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
        
        {/* Features/Specs */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          {product.weight && (
            <div className="flex items-center gap-1">
              <FaFire className="text-red-600" />
              <span className="text-gray-400 text-sm">{product.weight}kg</span>
            </div>
          )}
          {product.brand && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-sm">{product.brand}</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="relative w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAdded ? (
              <>
                <FaCheckCircle className="animate-bounce" />
                Added to Cart!
              </>
            ) : (
              <>
                <FaShoppingCart />
                Add to Cart
              </>
            )}
          </span>
          <span className="absolute inset-0 bg-linear-to-r from-red-700 to-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </button>

        {/* Delivery Info */}
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            🚚 Free delivery and orders over KSh 5,000
          </p>
        </div>
      </div>
    </div>
  );
}