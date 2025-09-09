import { NextRequest, NextResponse } from 'next/server';
import { ensureMedicationReminderTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function GET(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const pool = getDbPool();
  const { rows } = await pool.query(
    `select r.id, r.due_at, r.status, s.medication_id
     from public.medication_reminders r
     join public.medication_schedules s on s.id = r.schedule_id
     where (($1::text is null) or s.user_id = $1) and ($2::timestamptz is null or r.due_at >= $2) and ($3::timestamptz is null or r.due_at <= $3)
     order by r.due_at asc`,
    [userId, from, to]
  );
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const body = await req.json();
  const { id, status } = body || {};
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const pool = getDbPool();
  const now = new Date().toISOString();
  if (status === 'acknowledged') {
    await pool.query(`update public.medication_reminders set status='acknowledged', ack_at=$1 where id=$2`, [now, id]);
  }
  return NextResponse.json({ updated: true });
}


