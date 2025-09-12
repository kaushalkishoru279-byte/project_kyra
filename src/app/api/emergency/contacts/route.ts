import { NextRequest, NextResponse } from 'next/server';
import { ensureEmergencyTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function GET(req: NextRequest) {
  await ensureEmergencyTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([]);
  const { rows } = await pool.query(`select id, emergency_type, contact_name, contact_phone, tag from public.emergency_contacts where user_id=$1 order by created_at desc`, [userId]);
  return NextResponse.json(rows.map(r => ({ id: r.id, emergencyType: r.emergency_type, contactName: r.contact_name, contactPhone: r.contact_phone, tag: r.tag ?? undefined })));
}

export async function POST(req: NextRequest) {
  await ensureEmergencyTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const { emergencyType, contactName, contactPhone, tag } = await req.json();
  if (!emergencyType || !contactName || !contactPhone) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const { rows } = await pool.query(`insert into public.emergency_contacts (user_id, emergency_type, contact_name, contact_phone, tag) values ($1,$2,$3,$4,$5) returning id`, [userId, emergencyType, contactName, contactPhone, tag ?? null]);
  return NextResponse.json({ id: rows[0].id });
}

export async function DELETE(req: NextRequest) {
  await ensureEmergencyTables();
  const pool = getDbPool();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await pool.query(`delete from public.emergency_contacts where id=$1 and user_id=$2`, [id, userId]);
  return NextResponse.json({ deleted: true });
}




