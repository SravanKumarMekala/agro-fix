// app/orders/confirmation/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Fix: import separately
import styles from './page.module.css';
import axios from 'axios';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams(); // Moved up
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    if (!id) {
      setError('No order ID found in the URL.');
      setLoading(false);
      return;
    }

    setOrderId(id);
    console.log('Order ID received on confirmation page:', id);
    fetchOrderDetails(id);
  }, [searchParams]);

  const fetchOrderDetails = async (id) => {
    try {
      console.log('Fetching order details for ID:', id);
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading order details...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Confirmation</h1>
      {orderId && (
        <p className={styles.confirmationText}>
          Your order has been placed successfully!<br />
          Your Order ID is: <strong className={styles.orderId}>{orderId}</strong>
        </p>
      )}

      {order && (
        <div className={styles.orderDetails}>
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> {order.id}</p>
          <h3>Items:</h3>
          <ul>
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map(item => (
                <li key={item.product_id}>
                  Product ID: {item.product_id}, Quantity: {item.quantity}
                </li>
              ))
            ) : (
              <li>No items in this order.</li>
            )}
          </ul>
          {order.total_amount && <p><strong>Total:</strong> ₹{order.total_amount}</p>}
          {order.delivery_address && <p><strong>Delivery Address:</strong> {order.delivery_address}</p>}
        </div>
      )}

      <p>
        You can track your order on the{' '}
        <Link href="/orders/track" className={styles.trackLink}>Track Order</Link> page.
      </p>

      <Link href="/" className={styles.homeLink}>Go back to shopping</Link>
    </div>
  );
}
