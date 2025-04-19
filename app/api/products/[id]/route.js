// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, context) {
  const { params } = context;
  const { id } = params;
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json({ error: `Failed to fetch product ${id}` }, { status: 500 });
  }

}

export async function PUT(request, context) {
  const { params } = context;
  const { id } = params;
  const { name, price, description, image_url } = await request.json();

  if (!name || price === undefined || price === null) {
    return NextResponse.json({ error: 'Missing required product details (name, price)' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, price, description, image_url, id]
    );
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return NextResponse.json({ error: `Failed to update product ${id}` }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Product with ID ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return NextResponse.json({ error: `Failed to delete product ${id}` }, { status: 500 });
  }
}