import { NextRequest, NextResponse } from 'next/server';
import { ensureMedicationReminderTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function GET(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  const pool = getDbPool();
  const { rows } = await pool.query(`select id, medication_id, timezone, rule, start_date, end_date, next_occurrence from public.medication_schedules where ($1::text is null or user_id=$1) order by created_at desc`, [userId]);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const body = await req.json();
  const { medicationId, timezone, rule, startDate, endDate } = body || {};
  const pool = getDbPool();
  const { rows } = await pool.query(`insert into public.medication_schedules (user_id, medication_id, timezone, rule, start_date, end_date) values ($1,$2,$3,$4,$5,$6) returning id`, [userId, medicationId, timezone, rule, startDate, endDate ?? null]);
  return NextResponse.json({ id: rows[0].id });
}

export async function DELETE(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const pool = getDbPool();
  await pool.query(`delete from public.medication_schedules where id=$1 and user_id=$2`, [id, userId]);
  return NextResponse.json({ deleted: true });
}


