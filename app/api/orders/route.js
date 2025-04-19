// app/api/orders/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM orders ORDER BY created_at DESC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { buyer_name, buyer_contact, delivery_address, items } = await request.json();

    if (!buyer_name || !buyer_contact || !delivery_address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items) VALUES ($1, $2, $3, $4) RETURNING id',
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items)]
    );
    client.release();

    return NextResponse.json({ orderId: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}