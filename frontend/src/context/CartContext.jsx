import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);

  // Sync cart whenever auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      // Guest cart stored in localStorage
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          setCart(parsed);
        } catch (e) {
          setCart({ items: [], subtotal: 0 });
        }
      } else {
        setCart({ items: [], subtotal: 0 });
      }
    }
  }, [isAuthenticated]);

  const fetchBackendCart = async () => {
    setLoading(true);
    try {
      const res = await cartAPI.getCart();
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.warn('Failed to fetch backend cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.addToCart(product.id, quantity);
        if (res.data.success) {
          setCart(res.data.cart);
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add item to cart.';
        return { success: false, message: msg };
      }
    } else {
      // Guest Cart logic
      const items = [...cart.items];
      const existingIdx = items.findIndex(item => item.productId === product.id);

      if (existingIdx > -1) {
        items[existingIdx].quantity += quantity;
        items[existingIdx].itemTotal = items[existingIdx].quantity * product.price;
      } else {
        items.push({
          itemId: `guest_${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url || product.imageUrl,
          category: product.category,
          stock: product.stock,
          quantity: quantity,
          itemTotal: product.price * quantity
        });
      }

      const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
      const newCart = { items, subtotal: parseFloat(subtotal.toFixed(2)) };
      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return { success: true };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateQuantity(itemId, quantity);
        if (res.data.success) {
          setCart(res.data.cart);
        }
      } catch (err) {
        console.error('Failed to update item quantity:', err);
      }
    } else {
      let items = [...cart.items];
      if (quantity <= 0) {
        items = items.filter(item => item.itemId !== itemId);
      } else {
        items = items.map(item => {
          if (item.itemId === itemId) {
            const updatedQty = quantity;
            return {
              ...item,
              quantity: updatedQty,
              itemTotal: item.price * updatedQty
            };
          }
          return item;
        });
      }
      const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
      const newCart = { items, subtotal: parseFloat(subtotal.toFixed(2)) };
      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeItem(itemId);
        if (res.data.success) {
          setCart(res.data.cart);
        }
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    } else {
      const items = cart.items.filter(item => item.itemId !== itemId);
      const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
      const newCart = { items, subtotal: parseFloat(subtotal.toFixed(2)) };
      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
    }
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0 });
    localStorage.removeItem('guest_cart');
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, fetchBackendCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
