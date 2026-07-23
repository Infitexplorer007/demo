import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'mock-database.json');

const defaultData = {
  products: [
    {
      _id: '1',
      name: 'Industrial Steel',
      category: 'Steel',
      manufacturer: 'Apex Steel Corp',
      description: 'Premium structural steel for industrial construction projects.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      price: null,
      tags: ['Raw Material', 'ISO Certified'],
      featured: true,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Heavy Duty Pumps',
      category: 'Machinery',
      manufacturer: 'HydroFlow Dynamics',
      description: 'High-capacity pumps designed for demanding industrial environments.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      price: 25000,
      tags: ['Heavy Duty', 'Industrial'],
      featured: true,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Industrial Valves',
      category: 'Industrial Equipment',
      manufacturer: 'Precision Flow',
      description: 'Precision-engineered valves to regulate flow safely.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
      price: null,
      tags: ['Precision', 'High Pressure'],
      featured: false,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      name: 'Portland Cement OPC 53',
      category: 'Construction',
      manufacturer: 'UltraTech Cement',
      description: 'Ordinary Portland Cement Grade 53 for RCC construction.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
      price: 420,
      tags: ['OPC 53', 'Bulk'],
      featured: true,
      active: true,
      createdAt: new Date().toISOString()
    }
  ],
  quotations: []
};

export async function getMockDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function saveMockDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// These flags check if the user is still using the placeholder credentials
export const isMockMongo = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USER');
export const isMockPg = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_USER');
