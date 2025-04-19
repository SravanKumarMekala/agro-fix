// app/components/product-card.js
'use client';

import React, { useState, useEffect } from 'react';
import styles from './product-card.module.css';

export default function ProductCard({ product, onQuantityChange }) {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    onQuantityChange(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
      onQuantityChange(product.id, quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(isNaN(newQuantity) ? 0 : newQuantity);
    onQuantityChange(product.id, isNaN(newQuantity) ? 0 : newQuantity);
  };

  // Reset quantity when a new product is loaded (optional, based on your desired behavior)
  useEffect(() => {
    setQuantity(0);
  }, [product.id]);

  return (
    <div className={styles.card}>
      <img src={product.image_url} alt={product.name} className={styles.image} />
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.price}>₹{product.price}</p>
      <div className={styles.quantityControl}>
        <button onClick={handleDecrement} className={styles.button}>-</button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button onClick={handleIncrement} className={styles.button}>+</button>
      </div>
    </div>
  );
}