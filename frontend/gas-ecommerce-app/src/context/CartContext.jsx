import { createContext, useEffect, useState } from "react";
import { getCart, addToCart as apiAddToCart } from "../api/cartApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const token = localStorage.getItem("access");

    const fetchCart = async () => {
        // Guest user - get from localStorage
        if (!token) {
            const localCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
            const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
            return;
        }

        // Logged in user - get from API
        try {
            const res = await getCart();
            const items = res.data.items || [];
            const totalItems = items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            setCartCount(totalItems);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartCount(0);
        }
    };

    const addToCart = async (product_id, quantity = 1) => {
        // Guest user - save to localStorage
        if (!token) {
            const localCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
            const existingItem = localCart.find(item => item.product_id === product_id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.push({ product_id, quantity });
            }
            
            localStorage.setItem("guest_cart", JSON.stringify(localCart));
            await fetchCart();
            return { data: { message: "Added to cart (guest)" } };
        }

        // Logged in user - use API
        try {
            const response = await apiAddToCart(product_id, quantity);
            await fetchCart(); // Refresh cart count
            return response;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    // Merge guest cart with user cart after login
    const mergeGuestCart = async () => {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        
        if (guestCart.length > 0 && token) {
            for (const item of guestCart) {
                try {
                    await apiAddToCart(item.product_id, item.quantity);
                } catch (error) {
                    console.error("Error merging item:", error);
                }
            }
            // Clear guest cart after merging
            localStorage.removeItem("guest_cart");
            await fetchCart();
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    // Merge guest cart when user logs in
    useEffect(() => {
        if (token) {
            mergeGuestCart();
        }
    }, [token]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                fetchCart,
                addToCart 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};