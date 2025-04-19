// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT
        o.id, o.buyer_name, o.buyer_contact, o.delivery_address, o.created_at,
        oi.product_id, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
    `, [id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Process the result to format the items array
    const orderDetails = {
      id: result.rows[0].id,
      buyer_name: result.rows[0].buyer_name,
      buyer_contact: result.rows[0].buyer_contact,
      delivery_address: result.rows[0].delivery_address,
      created_at: result.rows[0].created_at,
      items: result.rows.map(row => ({
        product_id: row.product_id,
        quantity: row.quantity,
      })).filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.product_id === item.product_id && t.quantity === item.quantity
        ))
      ),
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error(`Error fetching order details ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch order details ${id}` }, { status: 500 });
  }
}