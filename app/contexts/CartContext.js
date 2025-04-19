// contexts/CartContext.js
'use client';

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);

  const addToCart = (productId, quantity) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + quantity,
    }));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => ({ ...prevCart, [productId]: quantity }));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const totalItemsInCart = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ cart, products, setCart, setProducts, addToCart, updateQuantity, removeFromCart, clearCart, totalItemsInCart }}>
      {children}
    </CartContext.Provider>
  );
};