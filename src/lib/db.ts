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

export async function ensureVaultTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    // Create vault_documents table if needed
    const docTable = await client.query(`select to_regclass('public.vault_documents') as reg`);
    if (!docTable.rows[0].reg) {
      await client.query(`create table public.vault_documents (
        id uuid primary key default uuid_generate_v4(),
        name text not null,
        mime_type text not null,
        size_bytes bigint not null,
        description text,
        type text,
        owner_id text,
        key_version int not null default 1,
        encrypted_data_key bytea not null,
        data_key_iv bytea not null,
        data_key_tag bytea not null,
        content_iv bytea not null,
        content_tag bytea not null,
        ciphertext bytea not null,
        created_at timestamptz not null default now()
      )`);
    } else {
      // Ensure new columns exist
      await client.query(`alter table public.vault_documents add column if not exists key_version int not null default 1`);
      await client.query(`alter table public.vault_documents add column if not exists owner_id text`);
    }

    // Create access table if needed
    const accessTable = await client.query(`select to_regclass('public.vault_document_access') as reg`);
    if (!accessTable.rows[0].reg) {
      await client.query(`create table public.vault_document_access (
        document_id uuid not null references public.vault_documents(id) on delete cascade,
        user_id text not null,
        role text not null check (role in ('owner','editor','viewer')),
        primary key (document_id, user_id)
      )`);
    }

    // Create audit table if needed
    const auditTable = await client.query(`select to_regclass('public.vault_document_audit') as reg`);
    if (!auditTable.rows[0].reg) {
      await client.query(`create table public.vault_document_audit (
        id bigserial primary key,
        document_id uuid,
        user_id text,
        action text not null check (action in ('upload','view','download','delete')),
        ip text,
        user_agent text,
        created_at timestamptz not null default now()
      )`);
    }
  } finally {
    client.release();
  }
}


