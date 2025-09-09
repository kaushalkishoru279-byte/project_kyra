import { NextRequest, NextResponse } from 'next/server';
import { ensureMedicationsTable, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function GET(req: NextRequest) {
  await ensureMedicationsTable();
  const userId = getUserId(req);
  const pool = getDbPool();
  const { rows } = await pool.query(`select id, name, dosage, frequency, notes, last_taken, next_due, taken_today from public.medications where ($1::text is null or user_id = $1) order by name asc`, [userId]);
  return NextResponse.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    dosage: r.dosage,
    frequency: r.frequency,
    notes: r.notes ?? undefined,
    lastTaken: r.last_taken ?? 'Not yet taken',
    nextDue: r.next_due ?? 'Pending schedule',
    takenToday: !!r.taken_today,
  })));
}

export async function POST(req: NextRequest) {
  await ensureMedicationsTable();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const body = await req.json();
  const { id, name, dosage, frequency, notes } = body || {};
  const pool = getDbPool();
  if (id) {
    await pool.query(`update public.medications set name=$1,dosage=$2,frequency=$3,notes=$4 where id=$5 and user_id=$6`, [name, dosage, frequency, notes ?? null, id, userId]);
    return NextResponse.json({ id, updated: true });
  } else {
    const { rows } = await pool.query(`insert into public.medications (user_id,name,dosage,frequency,notes,last_taken,next_due,taken_today) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`, [userId, name, dosage, frequency, notes ?? null, 'Not yet taken', 'Pending schedule', false]);
    return NextResponse.json({ id: rows[0].id });
  }
}

export async function DELETE(req: NextRequest) {
  await ensureMedicationsTable();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const pool = getDbPool();
  await pool.query(`delete from public.medications where id=$1 and user_id=$2`, [id, userId]);
  return NextResponse.json({ deleted: true });
}

export async function PATCH(req: NextRequest) {
  await ensureMedicationsTable();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const body = await req.json();
  const { id, takenToday, lastTaken } = body || {};
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const pool = getDbPool();
  await pool.query(`update public.medications set taken_today=$1,last_taken=$2 where id=$3 and user_id=$4`, [!!takenToday, lastTaken ?? null, id, userId]);
  return NextResponse.json({ updated: true });
}



