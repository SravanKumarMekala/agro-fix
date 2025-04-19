// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/product-card';
import Link from 'next/link'; // Import Link
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [emptyCartError, setEmptyCartError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
        console.log('Products fetched:', response.data);
      } catch (err) {
        setError('Failed to load products.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    }

    fetchProducts();
  }, []);

  const updateTotalItemsInCart = (currentCart) => {
    const total = Object.values(currentCart).reduce((sum, qty) => sum + qty, 0);
    setTotalItemsInCart(total);
    console.log('Total items in cart:', total);
  };

  const handleQuantityChange = (productId, quantity) => {
    setCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        [productId]: quantity,
      };
      console.log('Cart updated:', updatedCart);
      updateTotalItemsInCart(updatedCart);
      return updatedCart;
    });
  };

  const handleOrderNowClick = () => {
    if (Object.keys(cart).some(productId => cart[productId] > 0)) {
      router.push('/cart'); // Navigate to cart page
      setEmptyCartError(null);
      console.log('Navigating to /cart');
    } else {
      setEmptyCartError('Please select at least one item to order.');
      console.log('Cart is empty, displaying error');
    }
  };

  useEffect(() => {
    updateTotalItemsInCart(cart);
  }, [cart]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Our Fresh Vegetables & Fruits</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {products.map((product) => (
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

      {emptyCartError && <p style={{ color: 'orange' }}>{emptyCartError}</p>}

      {/* The inline order form is removed from this page */}
    </div>
  );
}