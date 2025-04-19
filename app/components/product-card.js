// app/components/product-card.js
import React, { useState } from 'react';
import styles from './product-card.module.css';

function ProductCard({ product, onQuantityChange }) {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity >= 0 ? newQuantity : 0);
    if (onQuantityChange) {
      onQuantityChange(product.id, newQuantity >= 0 ? newQuantity : 0);
    }
  };

  return (
    <div className={styles.card}>
      <img src={product.image_url} alt={product.name} className={styles.image} />
      <div className={styles.details}>
        <h3>{product.name}</h3>
        <p>Price: ₹{product.price}</p>
        {product.description && <p>{product.description}</p>}
      </div>
      <div className={styles.quantity}>
        <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
        <input
          type="number"
          id={`quantity-${product.id}`}
          value={quantity}
          onChange={handleQuantityChange}
          min="0"
        />
      </div>
    </div>
  );
}

export default ProductCard;