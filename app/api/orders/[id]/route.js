// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) { // <--- Correct way to access params
  const { id } = params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch order ${id}` }, { status: 500 });
  }
}

export async function PUT(request, { params }) { // <--- Correct way to access params
  const { id } = params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Missing order status to update' }, { status: 400 });
  }

  const allowedStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: `Invalid order status: ${status}` }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return NextResponse.json({ error: `Failed to update order ${id}` }, { status: 500 });
  }
}