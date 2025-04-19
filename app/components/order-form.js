// app/components/order-form.js
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  buyer_name: yup.string().required('Name is required'),
  buyer_contact: yup.string().required('Contact information is required'),
  delivery_address: yup.string().required('Delivery address is required'),
});

function OrderForm({ cart, products, onSubmit, orderLoading }) { // Receive orderLoading prop
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedItems = Object.keys(cart)
    .filter(productId => cart[productId] > 0)
    .map(productId => {
      const product = products.find(p => p.id === parseInt(productId));
      return { ...product, quantity: cart[productId] };
    });

  const handleFormSubmit = (data) => {
    const items = selectedItems.map(item => ({ product_id: item.id, quantity: item.quantity }));
    onSubmit({ ...data, items });
  };

  return (
    <div>
      <h2>Order Details</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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

        <h3>Selected Items:</h3>
        {selectedItems.length > 0 ? (
          <ul>
            {selectedItems.map(item => (
              <li key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items selected.</p>
        )}

        <button type="submit" disabled={selectedItems.length === 0 || orderLoading}>
          {orderLoading ? 'Placing Order...' : 'Place Order'} {/* Update button text */}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;