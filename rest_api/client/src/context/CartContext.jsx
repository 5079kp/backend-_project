import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../Api/axiosInstance';
import { useAuth } from '../context/AuthContext'; // ✅ Fixed import

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch cart when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                // Load from localStorage for guests
                const localCart = loadLocalCart();
                setCartItems(localCart);
                return;
            }

            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/cart');
                // Normalize user cart data
                const normalizedItems = data.cartItems?.map(item => ({
                    product: item.product,
                    qty: item.qty,
                    _id: item._id
                })) || [];
                setCartItems(normalizedItems);
                setError(null);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setError('Failed to load cart');
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    // Sync guest cart to localStorage
    useEffect(() => {
        if (!user && cartItems.length >= 0) {
            saveLocalCart(cartItems);
        }
    }, [cartItems, user]);

    // Helper functions
    const loadLocalCart = () => {
        try {
            const savedCart = localStorage.getItem('guest_cart');
            if (!savedCart) return [];
            
            const parsedCart = JSON.parse(savedCart);
            // Validate cart structure
            return Array.isArray(parsedCart) ? parsedCart : [];
        } catch (error) {
            console.error('Error loading local cart:', error);
            return [];
        }
    };

    const saveLocalCart = (items) => {
        try {
            localStorage.setItem('guest_cart', JSON.stringify(items));
        } catch (error) {
            console.error('Error saving local cart:', error);
        }
    };

    const mergeGuestCartWithUserCart = async () => {
        const guestCart = loadLocalCart();
        if (guestCart.length === 0) return;

        setLoading(true);
        try {
            // Send each guest cart item to server
            for (const item of guestCart) {
                await axiosInstance.post('/cart', {
                    productId: item.product._id,
                    qty: item.qty
                });
            }
            // Clear guest cart after merge
            localStorage.removeItem('guest_cart');
            // Refresh user cart
            const { data } = await axiosInstance.get('/cart');
            setCartItems(data.cartItems || []);
        } catch (error) {
            console.error('Error merging cart:', error);
            setError('Failed to sync cart');
        } finally {
            setLoading(false);
        }
    };

    // Merge guest cart when user logs in
    useEffect(() => {
        if (user) {
            mergeGuestCartWithUserCart();
        }
    }, [user]);

    const addToCart = async (product, qty = 1) => {
        if (!product || !product._id) {
            setError('Invalid product');
            return { success: false, error: 'Invalid product' };
        }

        setError(null);
        
        try {
            if (user) {
                const { data } = await axiosInstance.post('/cart', {
                    productId: product._id,
                    qty
                });
                setCartItems(data.cartItems || []);
                return { success: true };
            } else {
                // Guest cart logic
                setCartItems(prev => {
                    const existingItemIndex = prev.findIndex(
                        item => item.product._id === product._id
                    );
                    
                    if (existingItemIndex > -1) {
                        // Update existing item
                        const updated = [...prev];
                        updated[existingItemIndex] = {
                            ...updated[existingItemIndex],
                            qty: updated[existingItemIndex].qty + qty
                        };
                        return updated;
                    } else {
                        // Add new item
                        return [...prev, { product, qty }];
                    }
                });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add to cart';
            setError(errorMsg);
            console.error('Add to cart error:', error);
            return { success: false, error: errorMsg };
        }
    };

    const updateCartItemQty = async (productId, qty) => {
        if (qty <= 0) {
            return removeFromCart(productId);
        }

        setError(null);
        
        try {
            if (user) {
                const { data } = await axiosInstance.put(`/cart/${productId}`, { qty });
                setCartItems(data.cartItems || []);
            } else {
                setCartItems(prev =>
                    prev.map(item =>
                        item.product._id === productId
                            ? { ...item, qty }
                            : item
                    )
                );
            }
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update quantity';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const removeFromCart = async (productId) => {
        setError(null);
        
        try {
            if (user) {
                const { data } = await axiosInstance.delete(`/cart/${productId}`);
                setCartItems(data.cartItems || []);
            } else {
                setCartItems(prev => prev.filter(item => item.product._id !== productId));
            }
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to remove item';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const clearCart = async () => {
        setError(null);
        
        try {
            if (user) {
                await axiosInstance.delete('/cart');
            }
            setCartItems([]);
            localStorage.removeItem('guest_cart');
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to clear cart';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Memoized calculations
    const cartTotal = cartItems.reduce(
        (acc, item) => acc + (item.qty || 0) * (item.product?.price || 0), 
        0
    );
    
    const cartCount = cartItems.reduce(
        (acc, item) => acc + (item.qty || 0), 
        0
    );

    // Group items by category (helpful for analytics)
    const cartItemsByCategory = cartItems.reduce((acc, item) => {
        const category = item.product?.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    const value = {
        cartItems,
        cartTotal,
        cartCount,
        loading,
        error,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartItemsByCategory,
        isEmpty: cartItems.length === 0,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};