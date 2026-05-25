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
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-black via-gray-900 to-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-1/2 space-y-6">
                            <div className="flex items-center gap-2 justify-center lg:justify-start">
                                <div className="h-px w-12 bg-red-600"></div>
                                <span className="text-red-600 font-semibold uppercase tracking-wider">Welcome to GasMarket</span>
                                <div className="h-px w-12 bg-red-600"></div>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold text-white">
                                Premium Gas & 
                                <span className="text-red-600 block mt-2"> Energy Solutions</span>
                            </h1>
                            <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0">
                                Your trusted source for high-quality gas products, cylinders, and accessories. Safe, reliable, and delivered to your doorstep.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25">
                                    Shop Now
                                </button>
                                <button className="px-8 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                                {/* Gas Cylinder SVG */}
                                <svg className="relative w-64 h-64 mx-auto animate-bounce-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Cylinder Body */}
                                    <rect x="30" y="25" width="40" height="55" rx="5" fill="url(#cylinderGradient)" stroke="#DC2626" strokeWidth="2"/>
                                    {/* Cylinder Top Cap */}
                                    <rect x="35" y="20" width="30" height="8" rx="2" fill="#DC2626"/>
                                    {/* Cylinder Valve */}
                                    <rect x="45" y="10" width="10" height="12" rx="2" fill="#DC2626"/>
                                    <circle cx="50" cy="10" r="4" fill="#EF4444"/>
                                    {/* Cylinder Bottom Ring */}
                                    <rect x="28" y="78" width="44" height="6" rx="2" fill="#DC2626"/>
                                    {/* Highlight Effect */}
                                    <rect x="35" y="30" width="8" height="40" rx="2" fill="white" opacity="0.15"/>
                                    {/* Pressure Gauge */}
                                    {/* <circle cx="50" cy="50" r="8" fill="#1F2937" stroke="#DC2626" strokeWidth="1.5"/> */}
                                    {/* <circle cx="50" cy="50" r="2" fill="#DC2626"/>
                                    <line x1="50" y1="50" x2="54" y2="46" stroke="#DC2626" strokeWidth="1.5"/> */}
                                    
                                    <defs>
                                        <linearGradient id="cylinderGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#374151"/>
                                            <stop offset="50%" stopColor="#4B5563"/>
                                            <stop offset="100%" stopColor="#1F2937"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">Why Choose GasMarket?</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                        <p className="text-gray-700 font-semibold mt-4">We provide the best gas products with unmatched service</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group bg-linear-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaFire className="text-red-600 text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
                            <p className="text-gray-400">Highest quality gas products with safety certifications</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaTruck className="text-red-600 text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
                            <p className="text-gray-400">Same-day delivery available for select locations</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaShieldAlt className="text-red-600 text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Safety First</h3>
                            <p className="text-gray-400">All products meet strict safety standards</p>
                        </div>
                        
                        <div className="group bg-linear-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-red-600 transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <FaStar className="text-red-600 text-2xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                            <p className="text-gray-400">Customer support available around the clock</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="bg-linear-to-b from-white to-gray-500 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-black mb-4">Featured Products</h2>
                            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                            <p className="text-gray-700 font-semibold mt-4">Our most popular gas products</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    featured={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Products Section */}
            <section className="bg-linear-to-b from-gray-500 to-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black mb-4">All Gas Products</h2>
                        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                        <p className="text-gray-100 font-semibold  mt-4">Browse our complete collection</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
                                <p className="text-gray-400 mt-4">Loading products...</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

            {/* Newsletter Section */}
            <section className="bg-linear-to-r from-red-600 to-red-800 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-white/90 mb-8">Subscribe to get exclusive offers and safety tips</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 font-semibold">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}