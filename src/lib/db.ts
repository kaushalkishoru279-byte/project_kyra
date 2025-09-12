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

export async function ensureHealthTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const table = await client.query(`select to_regclass('public.health_readings') as reg`);
    if (!table.rows[0].reg) {
      await client.query(`create table public.health_readings (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        metric text not null,
        value_num double precision,
        value_json jsonb,
        unit text,
        source text,
        device_id text,
        taken_at timestamptz not null,
        created_at timestamptz not null default now()
      )`);
    }
    await client.query(`create index if not exists idx_health_readings_user_time on public.health_readings(user_id, taken_at desc)`);
    await client.query(`create index if not exists idx_health_readings_user_metric_time on public.health_readings(user_id, metric, taken_at desc)`);
  } finally {
    client.release();
  }
}

export async function ensureMedicationsTable(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const table = await client.query(`select to_regclass('public.medications') as reg`);
    if (!table.rows[0].reg) {
      await client.query(`create table public.medications (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        name text not null,
        dosage text not null,
        frequency text not null,
        notes text,
        last_taken text,
        next_due text,
        taken_today boolean not null default false,
        created_at timestamptz not null default now()
      )`);
    }
    await client.query(`create index if not exists idx_medications_user on public.medications(user_id)`);
  } finally {
    client.release();
  }
}

export async function ensureMedicationReminderTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const sched = await client.query(`select to_regclass('public.medication_schedules') as reg`);
    if (!sched.rows[0].reg) {
      await client.query(`create table public.medication_schedules (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        medication_id uuid not null references public.medications(id) on delete cascade,
        timezone text not null,
        rule jsonb not null,
        start_date date not null,
        end_date date,
        next_occurrence timestamptz,
        created_at timestamptz not null default now()
      )`);
    }
    const rem = await client.query(`select to_regclass('public.medication_reminders') as reg`);
    if (!rem.rows[0].reg) {
      await client.query(`create table public.medication_reminders (
        id uuid primary key default uuid_generate_v4(),
        schedule_id uuid not null references public.medication_schedules(id) on delete cascade,
        due_at timestamptz not null,
        status text not null default 'pending' check (status in ('pending','sent','ack','missed')),
        sent_at timestamptz,
        ack_at timestamptz,
        created_at timestamptz not null default now()
      )`);
    }
    await client.query(`create index if not exists idx_medication_reminders_due on public.medication_reminders(due_at)`);
  } finally {
    client.release();
  }
}

export async function ensureNewsTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const table = await client.query(`select to_regclass('public.news_articles') as reg`);
    if (!table.rows[0].reg) {
      await client.query(`create table public.news_articles (
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        description text,
        url text not null,
        image_url text,
        source text not null,
        published_at timestamptz not null,
        category text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`);
      
      // Create indexes for efficient querying
      await client.query(`create index if not exists idx_news_articles_published_at on public.news_articles(published_at desc)`);
      await client.query(`create index if not exists idx_news_articles_source on public.news_articles(source)`);
      await client.query(`create index if not exists idx_news_articles_category on public.news_articles(category)`);
    }
  } finally {
    client.release();
  }
}


export async function ensureShoppingTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const lists = await client.query(`select to_regclass('public.shopping_lists') as reg`);
    if (!lists.rows[0].reg) {
      await client.query(`create table if not exists public.shopping_lists (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        name text not null,
        created_at timestamptz not null default now()
      )`);
      await client.query(`create index if not exists idx_shopping_lists_user on public.shopping_lists(user_id)`);
    }

    const items = await client.query(`select to_regclass('public.shopping_items') as reg`);
    if (!items.rows[0].reg) {
      await client.query(`create table if not exists public.shopping_items (
        id uuid primary key default uuid_generate_v4(),
        list_id uuid not null references public.shopping_lists(id) on delete cascade,
        text text not null,
        completed boolean not null default false,
        created_at timestamptz not null default now()
      )`);
      await client.query(`create index if not exists idx_shopping_items_list on public.shopping_items(list_id)`);
    }
  } finally {
    client.release();
  }
}


export async function ensureEmergencyTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    const contacts = await client.query(`select to_regclass('public.emergency_contacts') as reg`);
    if (!contacts.rows[0].reg) {
      await client.query(`create table if not exists public.emergency_contacts (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        emergency_type text not null,
        contact_name text not null,
        contact_phone text not null,
        tag text,
        created_at timestamptz not null default now()
      )`);
      await client.query(`create index if not exists idx_emergency_contacts_user on public.emergency_contacts(user_id)`);
    }
  } finally {
    client.release();
  }
}

export async function ensureChatTables(): Promise<void> {
  const client = await getDbPool().connect();
  try {
    await client.query('create extension if not exists "uuid-ossp"');
    
    // Create conversations table
    const conversations = await client.query(`select to_regclass('public.chat_conversations') as reg`);
    if (!conversations.rows[0].reg) {
      await client.query(`create table if not exists public.chat_conversations (
        id uuid primary key default uuid_generate_v4(),
        user_id text not null,
        title text not null default 'New Chat',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`);
      await client.query(`create index if not exists idx_chat_conversations_user on public.chat_conversations(user_id)`);
      await client.query(`create index if not exists idx_chat_conversations_updated on public.chat_conversations(updated_at desc)`);
    }

    // Create messages table
    const messages = await client.query(`select to_regclass('public.chat_messages') as reg`);
    if (!messages.rows[0].reg) {
      await client.query(`create table if not exists public.chat_messages (
        id uuid primary key default uuid_generate_v4(),
        conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
        role text not null check (role in ('user', 'assistant', 'system')),
        content text not null,
        created_at timestamptz not null default now()
      )`);
      await client.query(`create index if not exists idx_chat_messages_conversation on public.chat_messages(conversation_id)`);
      await client.query(`create index if not exists idx_chat_messages_created on public.chat_messages(created_at)`);
    }
  } finally {
    client.release();
  }
}


