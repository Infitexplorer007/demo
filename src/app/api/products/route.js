import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getTokenFromRequest } from '@/lib/auth';
import { getMockDb, saveMockDb, isMockMongo } from '@/lib/mockDb';

// GET /api/products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all');

    if (isMockMongo) {
      const db = await getMockDb();
      let products = db.products;

      if (!all) products = products.filter((p) => p.active);
      if (category && category !== 'All') products = products.filter((p) => p.category === category);
      if (search) products = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      if (featured === 'true') products = products.filter((p) => p.featured);

      // Sort newest first
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return NextResponse.json({ success: true, data: products });
    }

    // Real MongoDB logic
    await connectDB();
    const filter = {};
    if (!all) filter.active = true;
    if (category && category !== 'All') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (featured === 'true') filter.featured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const decoded = getTokenFromRequest(request);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, description, category, image } = body;
    if (!name || !description || !category || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (isMockMongo) {
      const db = await getMockDb();
      const newProduct = {
        ...body,
        _id: Math.random().toString(36).substring(2, 10),
        createdAt: new Date().toISOString()
      };
      db.products.push(newProduct);
      await saveMockDb(db);
      return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    }

    // Real MongoDB logic
    await connectDB();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
