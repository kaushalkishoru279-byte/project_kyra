import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function ensureRecordsTable(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query(`
      create extension if not exists "uuid-ossp";
      create table if not exists medical_records (
        id uuid primary key default uuid_generate_v4(),
        name text not null,
        mime_type text not null,
        size_bytes bigint not null,
        tags text[] default array[]::text[],
        content bytea not null,
        created_at timestamptz not null default now()
      );
    `);
  } finally {
    client.release();
  }
}


