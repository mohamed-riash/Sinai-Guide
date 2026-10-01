import React, { createContext, useState, useEffect } from 'react';
import { storageService, KEYS } from '../services/storageService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => storageService.getItem(KEYS.CART, { place: null, items: [] }));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    storageService.setItem(KEYS.CART, cart);
  }, [cart]);

  const addItem = (place, item) => {
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
  };

  const updateQuantity = (itemId, quantity) => {
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
  };

  const removeItem = (itemId) => {
    updateQuantity(itemId, 0);
  };

  const clearCart = () => {
    setCart({ place: null, items: [] });
  };

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cart.items.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;
  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      setIsOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal,
      deliveryFee,
      total,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
