import pkg from 'pg';
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable in .env.local');
}

// Connection pool — reuse connections instead of creating new ones each time
const pool = new Pool({ connectionString: DATABASE_URL });

// Generic query helper — use this everywhere instead of pool.query directly
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Creates the quotations table if it doesn't exist yet — runs on first API call
export async function initQuotationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      products JSONB NOT NULL DEFAULT '[]',
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export default pool;
