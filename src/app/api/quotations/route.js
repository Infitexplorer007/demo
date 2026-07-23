import { NextResponse } from 'next/server';
import { query, initQuotationsTable } from '@/lib/postgresql';
import { getMockDb, saveMockDb, isMockPg } from '@/lib/mockDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, products, message, company } = body;

    if (!customer_name || !customer_email || !products || products.length === 0) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    if (isMockPg) {
      const db = await getMockDb();
      const newQuote = {
        id: Math.random().toString(36).substring(2, 10),
        customer_name, customer_email, company, products, message,
        created_at: new Date().toISOString()
      };
      db.quotations.push(newQuote);
      await saveMockDb(db);
      return NextResponse.json({ success: true, data: newQuote }, { status: 201 });
    }

    await initQuotationsTable();
    const result = await query(
      `INSERT INTO quotations (customer_name, customer_email, company, products, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_name, customer_email, company || null, JSON.stringify(products), message || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    if (isMockPg) {
      const db = await getMockDb();
      return NextResponse.json({ success: true, data: db.quotations.reverse() });
    }

    await initQuotationsTable();
    const result = await query('SELECT * FROM quotations ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
