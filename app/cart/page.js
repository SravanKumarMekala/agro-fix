// app/cart/page.js
'use client';

import React from 'react';
import { useRouter, Link } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Dummy data - REPLACE WITH YOUR STATE MANAGEMENT
const dummyProducts = [
  // Your product data here
  { id: 1, name: 'Carrot', price: 20, image_url: '/images/carrot.jpg' },
  { id: 2, name: 'Apple', price: 50, image_url: '/images/apple.jpg' },
  { id: 3, name: 'Banana', price: 15, image_url: '/images/banana.jpg' },
];

const dummyCart = {
  1: 2,
  2: 1,
};

const schema = yup.object().shape({
  buyer_name: yup.string().required('Name is required'),
  buyer_contact: yup.string().required('Contact information is required'),
  delivery_address: yup.string().required('Delivery address is required'),
});

export default function CartPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // REPLACE WITH YOUR STATE RETRIEVAL LOGIC
  const products = dummyProducts;
  const cart = dummyCart;

  const selectedItems = Object.keys(cart)
    .filter(productId => cart[productId] > 0)
    .map(productId => {
      const product = products.find(p => p.id === parseInt(productId));
      return { ...product, quantity: cart[productId] };
    });

  const calculateTotalBill = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async (data) => {
    const items = selectedItems.map(item => ({ product_id: item.id, quantity: item.quantity }));
    const orderData = { ...data, items };
    console.log('Placing order with:', orderData);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Order placed successfully:', result);
        router.push(`/orders/track?orderId=${result.orderId}`); // Redirect to track order page
        // Optionally clear the cart state here
      } else {
        console.error('Failed to place order:', result);
        // Display error message to the user
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Display error message to the user
    }
  };

  if (selectedItems.length === 0) {
    return <p>Your cart is empty. <Link href="/">Go back to shopping</Link>.</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {selectedItems.map(item => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity} - Price: ₹{item.price} - Subtotal: ₹{item.price * item.quantity}
          </li>
        ))}
      </ul>

      <h2>Total Bill: ₹{calculateTotalBill()}</h2>

      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit(handlePlaceOrder)}>
        <div>
          <label htmlFor="buyer_name">Name:</label>
          <input type="text" id="buyer_name" {...register('buyer_name')} />
          {errors.buyer_name && <p>{errors.buyer_name.message}</p>}
        </div>
        <div>
          <label htmlFor="buyer_contact">Contact:</label>
          <input type="text" id="buyer_contact" {...register('buyer_contact')} />
          {errors.buyer_contact && <p>{errors.buyer_contact.message}</p>}
        </div>
        <div>
          <label htmlFor="delivery_address">Delivery Address:</label>
          <textarea id="delivery_address" {...register('delivery_address')} />
          {errors.delivery_address && <p>{errors.delivery_address.message}</p>}
        </div>
        <button type="submit">Place Order</button>
      </form>

      <button onClick={() => router.back()}>Go Back to Shopping</button>
    </div>
  );
}