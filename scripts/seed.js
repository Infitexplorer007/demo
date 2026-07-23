// Run this script to seed the database with sample products
// Usage: node scripts/seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

const ProductSchema = new mongoose.Schema({
  name: String, category: String, manufacturer: String,
  description: String, image: String, price: Number,
  tags: [String], featured: Boolean, active: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: 'Industrial Steel',
    category: 'Steel',
    manufacturer: 'Apex Steel Corp',
    description: 'Premium structural steel for industrial construction projects. Available in multiple grades.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    price: null,
    tags: ['Raw Material', 'ISO Certified', 'Bulk Available'],
    featured: true, active: true,
  },
  {
    name: 'Heavy Duty Pumps',
    category: 'Machinery',
    manufacturer: 'HydroFlow Dynamics',
    description: 'High-capacity pumps designed for demanding industrial environments and continuous use.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    price: 25000,
    tags: ['Heavy Duty', 'Industrial'],
    featured: true, active: true,
  },
  {
    name: 'Industrial Valves',
    category: 'Industrial Equipment',
    manufacturer: 'Precision Flow',
    description: 'Precision-engineered valves to regulate flow safely in high-pressure pipelines.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    price: null,
    tags: ['Precision', 'High Pressure'],
    featured: false, active: true,
  },
  {
    name: 'Portland Cement OPC 53',
    category: 'Construction',
    manufacturer: 'UltraTech Cement',
    description: 'Ordinary Portland Cement Grade 53 for RCC construction. High strength and durability.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
    price: 420,
    tags: ['OPC 53', 'ISI Marked', 'Bulk'],
    featured: true, active: true,
  },
  {
    name: 'Safety Helmets (Pack of 10)',
    category: 'Safety',
    manufacturer: 'Guardian Safety',
    description: 'ISI certified hard hats for construction site personnel. HDPE shell with foam padding.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    price: 1500,
    tags: ['ISI Certified', 'Safety', 'PPE'],
    featured: false, active: true,
  },
  {
    name: 'LED Work Light 100W',
    category: 'Electrical',
    manufacturer: 'VoltTech Industries',
    description: 'Waterproof LED flood light for construction sites and industrial work areas.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    price: 3500,
    tags: ['LED', 'Waterproof', 'IP65'],
    featured: false, active: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Product.deleteMany({});
  console.log('🗑  Cleared existing products');

  await Product.insertMany(sampleProducts);
  console.log(`✅ Inserted ${sampleProducts.length} sample products`);

  await mongoose.disconnect();
  console.log('👋 Done! Visit /products to see them.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
