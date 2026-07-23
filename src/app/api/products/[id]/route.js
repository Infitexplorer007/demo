import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getTokenFromRequest } from '@/lib/auth';
import { getMockDb, saveMockDb, isMockMongo } from '@/lib/mockDb';

// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (isMockMongo) {
      const db = await getMockDb();
      const product = db.products.find((p) => p._id === id);
      if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: product });
    }

    await connectDB();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const decoded = getTokenFromRequest(request);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (isMockMongo) {
      const db = await getMockDb();
      const index = db.products.findIndex((p) => p._id === id);
      if (index === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      
      db.products[index] = { ...db.products[index], ...body, updatedAt: new Date().toISOString() };
      await saveMockDb(db);
      return NextResponse.json({ success: true, data: db.products[index] });
    }

    await connectDB();
    const product = await Product.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const decoded = getTokenFromRequest(request);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    if (isMockMongo) {
      const db = await getMockDb();
      const index = db.products.findIndex((p) => p._id === id);
      if (index === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      
      db.products.splice(index, 1);
      await saveMockDb(db);
      return NextResponse.json({ success: true, message: 'Deleted successfully' });
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
