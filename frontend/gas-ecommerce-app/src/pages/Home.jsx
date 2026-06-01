import { useEffect, useState, useContext } from "react";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { FaFire, FaTruck, FaShieldAlt, FaStar } from "react-icons/fa";

export default function Home() {
    const { addToCart, fetchCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getProducts();
            setProducts(res.data);
            setFeaturedProducts(res.data.slice(0, 3));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    return (
        <div>
            {/* All Products Section */}
            <section className="bg-linear-to-b from-white to-gray-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">All Gas Products</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                        <p className="text-gray-500 font-semibold mt-4">Browse our complete collection</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                <p className="text-gray-700 mt-4">Loading products...</p>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="30" y="25" width="40" height="55" rx="5" fill="#374151" stroke="#4B5563" strokeWidth="2"/>
                                <rect x="35" y="20" width="30" height="8" rx="2" fill="#4B5563"/>
                                <rect x="45" y="10" width="10" height="12" rx="2" fill="#4B5563"/>
                            </svg>
                            <p className="text-gray-400 text-lg">No products available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {/* Features Section */}
            <section className="bg-linear-to-b from-gray-400 to-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Why Choose GasMarket?</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                        <p className="text-gray-700 font-semibold mt-4">We provide the best gas products with unmatched service</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="group bg-linear-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaFire className="text-red-600 text-xl sm:text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">Premium Quality</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Highest quality gas products with safety certifications</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaTruck className="text-red-600 text-xl sm:text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">Fast Delivery</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Same-day delivery available for select locations</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaShieldAlt className="text-red-600 text-xl sm:text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">Safety First</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">All products meet strict safety standards</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaStar className="text-red-600 text-xl sm:text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">24/7 Support</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Customer support available around the clock</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}