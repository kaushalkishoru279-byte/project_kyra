import { NextRequest, NextResponse } from 'next/server';
import { ensureShoppingTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function GET(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([], { status: 200 });
  const { rows: lists } = await pool.query(`select id, name, created_at from public.shopping_lists where user_id=$1 order by created_at desc`, [userId]);
  const listIds = lists.map(l => l.id);
  let itemsByList: Record<string, any[]> = {};
  if (listIds.length > 0) {
    const { rows: items } = await pool.query(`select id, list_id, text, completed, created_at from public.shopping_items where list_id = any($1::uuid[]) order by created_at desc`, [listIds]);
    for (const it of items) {
      (itemsByList[it.list_id] ||= []).push(it);
    }
  }
  return NextResponse.json(lists.map(l => ({ id: l.id, name: l.name, items: (itemsByList[l.id] || []).map(it => ({ id: it.id, text: it.text, completed: it.completed })) })));
}

export async function POST(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const body = await req.json();
  const { name } = body || {};
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  const { rows } = await pool.query(`insert into public.shopping_lists (user_id, name) values ($1,$2) returning id, name`, [userId, name]);
  return NextResponse.json({ id: rows[0].id, name: rows[0].name });
}

export async function DELETE(req: NextRequest) {
  await ensureShoppingTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await pool.query(`delete from public.shopping_lists where id=$1 and user_id=$2`, [id, userId]);
  return NextResponse.json({ deleted: true });
}




