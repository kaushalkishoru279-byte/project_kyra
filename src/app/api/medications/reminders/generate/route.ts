import { NextRequest, NextResponse } from 'next/server';
import { ensureMedicationReminderTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

function timesForDate(date: Date, times: string[], tz: string): Date[] {
  return times.map(t => {
    const [h, m] = t.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m ?? 0, 0, 0);
    return d;
  });
}

export async function POST(req: NextRequest) {
  await ensureMedicationReminderTables();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const { scheduleId, days = 14 } = await req.json();
  const pool = getDbPool();
  const { rows } = await pool.query(`select id, rule, timezone, start_date, end_date from public.medication_schedules where id=$1 and user_id=$2`, [scheduleId, userId]);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const s = rows[0] as any;
  const rule = s.rule as { times: string[]; daysOfWeek?: number[] };
  const tz = s.timezone as string;
  const start = new Date(s.start_date);
  const endLimit = s.end_date ? new Date(s.end_date) : null;

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + days);

  const dueDates: Date[] = [];
  for (let d = new Date(now); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (endLimit && d > endLimit) break;
    if (d < start) continue;
    if (rule.daysOfWeek && !rule.daysOfWeek.includes(day)) continue;
    const candidates = timesForDate(new Date(d), rule.times, tz);
    for (const due of candidates) {
      // Skip times earlier than now on the current day
      if (d.toDateString() === now.toDateString() && due.getTime() < now.getTime()) continue;
      dueDates.push(due);
    }
  }

  const client = await pool.connect();
  try {
    await client.query('begin');
    for (const due of dueDates) {
      await client.query(`insert into public.medication_reminders (schedule_id, due_at) values ($1,$2) on conflict do nothing`, [scheduleId, due.toISOString()]);
    }
    await client.query('commit');
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
  return NextResponse.json({ generated: dueDates.length });
}


