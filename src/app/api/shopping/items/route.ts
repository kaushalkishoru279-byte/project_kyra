import { NextRequest, NextResponse } from 'next/server';
import { ensureShoppingTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function POST(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const { listId, text } = await req.json();
  if (!listId || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  // Ensure list belongs to user
  const { rows: owns } = await pool.query(`select 1 from public.shopping_lists where id=$1 and user_id=$2`, [listId, userId]);
  if (owns.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { rows } = await pool.query(`insert into public.shopping_items (list_id, text) values ($1,$2) returning id, text, completed`, [listId, text]);
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const { id, completed } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  // Ensure item belongs to user's list
  const { rows: itemRows } = await pool.query(`select i.list_id from public.shopping_items i join public.shopping_lists l on l.id=i.list_id where i.id=$1 and l.user_id=$2`, [id, userId]);
  if (itemRows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await pool.query(`update public.shopping_items set completed=$1 where id=$2`, [!!completed, id]);
  return NextResponse.json({ updated: true });
}

export async function DELETE(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  // Ensure item belongs to user's list
  const { rows: itemRows } = await pool.query(`select i.id from public.shopping_items i join public.shopping_lists l on l.id=i.list_id where i.id=$1 and l.user_id=$2`, [id, userId]);
  if (itemRows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await pool.query(`delete from public.shopping_items where id=$1`, [id]);
  return NextResponse.json({ deleted: true });
}




