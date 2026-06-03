import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { NotificationContext } from "../context/NotificationContext";
import { IoCartOutline } from "react-icons/io5";
import { FaBars, FaTimes, FaFire, FaUser, FaShoppingBag, FaInfoCircle, FaEnvelope, FaHome, FaBell } from "react-icons/fa";

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { unreadCount } = useContext(NotificationContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  
  // Check if user is logged in
  const token = localStorage.getItem("access");
  const isLoggedIn = !!token;

  // Get username from localStorage when logged in
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const userData = localStorage.getItem("user");
        
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username || user.email || "User");
        } else {
          // If no user data, try to get from the token or form input
          setUsername("User"); 
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUsername("Customer");
      }
    }
  }, [isLoggedIn]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please login/register to view your cart");
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-2xl" 
          : "bg-white shadow-lg border-b border-red-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo section */}
            <Link 
              to="/" 
              className="group relative flex items-center gap-2 overflow-hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="absolute inset-0 bg-linear-to-b-r from-red-600 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
              <FaFire className="text-red-600 text-2xl lg:text-3xl animate-pulse group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="font-bold text-xl lg:text-2xl">
                <span className="text-red-600 font-serif">Gas</span>
                <span className="font-serif text-black">Market</span>
              </h1>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-red-600 backdrop-blur-sm hover:bg-black transition-all duration-300 group order-first"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes size={22} className="text-white group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FaBars size={22} className="text-white group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Cart Icon */}
            <div className="md:hidden flex items-center gap-3">
              <Link 
                to="/cart" 
                className="relative group"
                onClick={handleCartClick}
              >
                <div className="relative">
                  <IoCartOutline className="h-6 w-6 text-black-300 group-hover:text-red-600 transition-all duration-300 group-hover:scale-110" />
                  {cartCount > 0 && (
                    <>
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-5 text-center animate-bounce">
                        {cartCount}
                      </span>
                      <span className="absolute -top-2 -right-2 w-full h-full animate-ping bg-red-600 rounded-full opacity-75"></span>
                    </>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              <div className="flex gap-6 lg:gap-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `relative group flex items-center gap-2 font-semibold transition-all duration-300 ${
                      isActive ? "text-red-600" : "text-black-300 hover:text-red-500"
                    }`
                  }
                >
                  <FaHome className="text-sm" />
                  <span>Home</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `relative group flex items-center gap-2 font-semibold transition-all duration-300 ${
                      isActive ? "text-red-600" : "text-black hover:text-red-500"
                    }`
                  }
                >
                  <FaInfoCircle className="text-sm" />
                  <span>About</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
                
                <NavLink 
                  to="/contact"
                  className={({ isActive }) => 
                    `relative group flex items-center gap-2 font-semibold transition-all duration-300 ${
                      isActive ? "text-red-600" : "text-black hover:text-red-500"
                    }`
                  }
                >
                  <FaEnvelope className="text-sm" />
                  <span>Contact</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </div>

              {/* Cart Icon with Animations */}
              <Link 
                to="/cart" 
                className="relative group"
                onClick={handleCartClick}
              >
                <div className="relative">
                  <IoCartOutline className="h-6 w-6 lg:h-7 lg:w-7 text-black-300 group-hover:text-red-600 transition-all duration-300 group-hover:scale-110" />
                  {cartCount > 0 && (
                    <>
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-5 text-center animate-bounce">
                        {cartCount}
                      </span>
                      <span className="absolute -top-2 -right-2 w-full h-full animate-ping bg-red-600 rounded-full opacity-75"></span>
                    </>
                  )}
                </div>
              </Link>

              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <Link 
                    to="/login" 
                    className="relative overflow-hidden px-5 py-2 text-black-900 border-2 border-red-600 rounded-lg font-semibold transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/25 group"
                  >
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-600/25 hover:scale-105 transform"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 cursor-pointer hover:bg-red-600 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <span className="text-white font-semibold hidden lg:inline">
                      {username}
                    </span>
                    <svg className={`w-4 h-4 text-white transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-red-600 rounded-lg shadow-2xl overflow-hidden z-50">
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-4 py-3 text-black-300 font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaShoppingBag />
                        <span>My Orders</span>
                      </Link>
                      
                      {/* Notification Bell */}
                      <Link 
                        to="/notifications" 
                        className="flex items-center gap-3 px-4 py-3 text-black font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaBell />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-black font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaUser />
                        <span>My Profile</span>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-black-300 font-semibold cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div className="md:hidden fixed top-16 lg:top-20 left-0 right-0 bg-linear-to-b from-black to-gray-900 shadow-2xl z-40 border-b-2 border-red-600 max-h-[calc(100vh-64px)] overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoggedIn && (
                  <div className="mb-6 p-4 bg-linear-to-b-r from-red-600/10 to-transparent rounded-xl border border-red-600/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <FaUser className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Welcome Back!</p>
                        <p className="text-gray-400 text-sm">{username}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <ul className="flex flex-col gap-2">
                  <NavLink 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `${isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-white/10 hover:text-white"} 
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group`
                    }
                  >
                    <FaHome className="text-xl" />
                    <span className="font-semibold">Home</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `${isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-white/10 hover:text-white"} 
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group`
                    }
                  >
                    <FaInfoCircle className="text-xl" />
                    <span className="font-semibold">About</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `${isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-white/10 hover:text-white"} 
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group`
                    }
                  >
                    <FaEnvelope className="text-xl" />
                    <span className="font-semibold">Contact</span>
                  </NavLink>

                  <NavLink 
                    to="/notifications" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `${isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-white/10 hover:text-white"} 
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group`
                    }
                  >
                    <FaBell className="text-xl" />
                    <span className="font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `${isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-white/10 hover:text-white"} 
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group`
                    }
                  >
                    <FaUser className="text-xl" />
                    <span className="font-semibold">My Profile</span>
                  </NavLink>
                  
                  <div className="h-px bg-linear-to-b-r from-transparent via-red-600 to-transparent my-3"></div>
                  <div className="mt-4">
                    <div className="h-px bg-linear-to-b-r from-transparent via-red-600 to-transparent mb-4"></div>
                    
                    {!isLoggedIn ? (
                      <div className="space-y-3 px-2">
                        <p className="text-gray-400 text-sm text-center mb-2">Access your account</p>
                        <div className="flex gap-3">
                          <Link 
                            to="/login" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 text-center px-4 py-3 bg-transparent border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
                          >
                            Login
                          </Link>
                          <Link 
                            to="/register" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 text-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 px-2">
                        <Link 
                          to="/orders" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border-2 border-gray-600 text-gray-300 rounded-xl hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold"
                        >
                          <FaShoppingBag />
                          My Orders
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="h-16 lg:h-20"></div>
    </>
  );
}