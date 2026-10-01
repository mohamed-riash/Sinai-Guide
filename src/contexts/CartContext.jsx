import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storageService, KEYS } from '../services/storageService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => storageService.getItem(KEYS.CART, { place: null, items: [] }));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    storageService.setItem(KEYS.CART, cart);
  }, [cart]);

  const addItem = useCallback((place, item) => {
    setCart(prev => {
      // If adding from a different place, reset cart for new restaurant
      if (prev.place && prev.place.id !== place.id) {
        return {
          place,
          items: [{ ...item, quantity: 1 }]
        };
      }

      const existingIndex = prev.items.findIndex(i => i.id === item.id);
      let newItems = [...prev.items];

      if (existingIndex > -1) {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        };
      } else {
        newItems.push({ ...item, quantity: 1 });
      }

      return {
        place,
        items: newItems
      };
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    setCart(prev => {
      if (quantity <= 0) {
        const filtered = prev.items.filter(i => i.id !== itemId);
        return {
          place: filtered.length > 0 ? prev.place : null,
          items: filtered
        };
      }
      return {
        ...prev,
        items: prev.items.map(i => i.id === itemId ? { ...i, quantity } : i)
      };
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    updateQuantity(itemId, 0);
  }, [updateQuantity]);

  const clearCart = useCallback(() => {
    setCart({ place: null, items: [] });
  }, []);

  const subtotal = useMemo(() => cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart.items]);
  const deliveryFee = cart.items.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;
  const totalItemCount = useMemo(() => cart.items.reduce((sum, item) => sum + item.quantity, 0), [cart.items]);
  const value = useMemo(() => ({ cart, isOpen, setIsOpen, addItem, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total, totalItemCount }), [cart, isOpen, addItem, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total, totalItemCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
