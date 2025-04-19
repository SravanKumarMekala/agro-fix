// app/api/orders/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  const client = await pool.connect(); // Connect once
  try {
    const { buyer_name, buyer_contact, delivery_address, items } = await request.json();

    if (!buyer_name || !buyer_contact || !delivery_address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    await client.query('BEGIN'); // Start a transaction

    // 1. Insert into the orders table and get the order ID, including items as JSON
    const orderResult = await client.query(
      'INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items) VALUES ($1, $2, $3, $4) RETURNING id',
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items)]
    );
    const orderId = orderResult.rows[0].id;

    // 2. Insert each item into the order_items table
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.product_id, item.quantity]
      );
    }

    await client.query('COMMIT'); // Commit the transaction

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction on error
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  } finally {
    client.release(); // Release the client
  }
}