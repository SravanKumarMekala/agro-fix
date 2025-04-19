// app/orders/track/page.js
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css'; // Import the CSS module

const formatDate = (isoDateString) => {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    setOrder(null);
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Order not found. Please check your Order ID.');
      } else {
        setError('Failed to track order. Please try again.');
        console.error('Error tracking order:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Track Your Order</h1>
      <div className={styles.inputContainer}>
        <label htmlFor="orderId" className={styles.label}>Order ID:</label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleTrackOrder} disabled={!orderId || loading} className={styles.button}>
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {loading && <p className={styles.loading}>Loading order details...</p>}

      {order && (
        <div className={styles.orderContainer}>
          <h2 className={styles.orderTitle}>Order Details</h2>
          <p className={styles.orderInfo}><strong>Order ID:</strong> {order.id}</p>
          <p className={styles.orderInfo}><strong>Buyer Name:</strong> {order.buyer_name}</p>
          <p className={styles.orderInfo}><strong>Contact:</strong> {order.buyer_contact}</p>
          <p className={styles.orderInfo}><strong>Delivery Address:</strong> {order.delivery_address}</p>
          <p className={styles.orderInfo}><strong>Status:</strong> {order.status}</p>
          <h3 className={styles.itemsTitle}>Items:</h3>
          {order.items && (Array.isArray(order.items) ? order.items : JSON.parse(order.items)).map((item, index) => (
            <p key={index} className={styles.orderInfo}>Product ID: {item.product_id}, Quantity: {item.quantity}</p>
          ))}
          <p className={styles.orderInfo}><strong>Placed On:</strong> {formatDate(order.created_at)}</p>
          {order.updated_at && <p className={styles.orderInfo}><strong>Last Updated:</strong> {formatDate(order.updated_at)}</p>}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}