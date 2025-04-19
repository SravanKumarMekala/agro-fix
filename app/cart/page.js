// app/cart/page.js
'use client';

import React from 'react';
import Link from 'next/link'; // ✅ Fixed import
import { useRouter } from 'next/navigation'; // ✅ Correct usage
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './page.module.css';
import useCartStore from '../../store'; // ✅ Ensure this path is correct

const schema = yup.object().shape({
  buyer_name: yup.string().required('Name is required'),
  buyer_contact: yup.string().required('Contact information is required'),
  delivery_address: yup.string().required('Delivery address is required'),
});

export default function CartPage() {
  const cart = useCartStore(state => state.cart);
  const products = useCartStore(state => state.products);
  const clearCart = useCartStore(state => state.clearCart);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedItems = Object.keys(cart)
    .filter(productId => cart[productId] > 0)
    .map(productId => {
      const product = products.find(p => p.id === parseInt(productId));
      return product ? { ...product, quantity: cart[productId] } : null;
    })
    .filter(item => item !== null);

  const calculateTotalBill = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async (data) => {
    const items = selectedItems.map(item => ({ product_id: item.id, quantity: item.quantity }));
    const orderData = { ...data, items };
    console.log('CART PAGE - Placing order with data:', orderData);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      console.log('CART PAGE - Order API Response:', result);
      if (response.ok) {
        clearCart();
        router.push(`/orders/confirmation?orderId=${result.orderId}`);
      } else {
        console.error('CART PAGE - Failed to place order:', result);
      }
    } catch (error) {
      console.error('CART PAGE - Error placing order (catch block):', error);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <p className={styles.container}>
        Your cart is empty. <Link href="/">Go back to shopping</Link>.
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>
      <ul className={styles.cartItems}>
        {selectedItems.map(item => (
          <li key={item.id} className={styles.cartItem}>
            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
            </div>
            <p className={styles.itemPrice}>
              ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </p>
          </li>
        ))}
      </ul>

      <h2 className={styles.totalBill}>Total Bill: ₹{calculateTotalBill()}</h2>

      <h2 className={styles.formTitle}>Enter Your Details</h2>
      <form onSubmit={handleSubmit(handlePlaceOrder)}>
        <div className={styles.formGroup}>
          <label htmlFor="buyer_name" className={styles.label}>Name:</label>
          <input type="text" id="buyer_name" {...register('buyer_name')} className={styles.input} />
          {errors.buyer_name && <p className={styles.error}>{errors.buyer_name.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="buyer_contact" className={styles.label}>Contact:</label>
          <input type="text" id="buyer_contact" {...register('buyer_contact')} className={styles.input} />
          {errors.buyer_contact && <p className={styles.error}>{errors.buyer_contact.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="delivery_address" className={styles.label}>Delivery Address:</label>
          <textarea id="delivery_address" {...register('delivery_address')} className={styles.textarea} />
          {errors.delivery_address && <p className={styles.error}>{errors.delivery_address.message}</p>}
        </div>
        <button type="submit" className={styles.placeOrderButton}>Place Order</button>
      </form>

      <button onClick={() => router.back()} className={styles.backButton}>Go Back to Shopping</button>
    </div>
  );
}
