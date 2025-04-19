// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/product-card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '../store'; // Adjust path if needed

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const totalItemsInCart = useCartStore(state => state.totalItemsInCart());
  const cart = useCartStore(state => state.cart);
  const setProducts = useCartStore(state => state.setProducts);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        setFetchedProducts(response.data);
        setProducts(response.data);
        setLoading(false);
        console.log('HOME PAGE - Products fetched:', response.data);
      } catch (err) {
        setError('Failed to load products.');
        setLoading(false);
        console.error('HOME PAGE - Error fetching products:', err);
      }
    }

    fetchProducts();
  }, [setProducts]);

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
    console.log('HOME PAGE - Cart updated (via Zustand):', useCartStore.getState().cart);
  };

  return (
    <div>
      <h1>Our Fresh Vegetables & Fruits</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {fetchedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
      <Link href="/cart" style={{ textDecoration: 'none' }}>
        <button disabled={Object.keys(cart).length === 0 || Object.values(cart).every(qty => qty === 0)}>
          View Cart ({totalItemsInCart})
        </button>
      </Link>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading products...</p>}
    </div>
  );
}