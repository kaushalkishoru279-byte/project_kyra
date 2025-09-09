import { NextRequest, NextResponse } from 'next/server';
import { ensureHealthTables, getDbPool } from '@/lib/db';

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id');
}

export async function GET(req: NextRequest) {
  await ensureHealthTables();
  const userId = getUserId(req);
  const url = new URL(req.url);
  const metric = url.searchParams.get('metric');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 500);
  const pool = getDbPool();
  const params: any[] = [];
  let where = '';
  if (userId) { params.push(userId); where += `user_id = $${params.length}`; }
  if (metric) { params.push(metric); where += (where ? ' and ' : '') + `metric = $${params.length}`; }
  const whereSql = where ? `where ${where}` : '';
  params.push(limit);
  const { rows } = await pool.query(
    `select id, user_id, metric, value_num, value_json, unit, source, device_id, taken_at, created_at
     from health_readings ${whereSql}
     order by taken_at desc
     limit $${params.length}`,
    params
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureHealthTables();
  const userId = getUserId(req);
  const body = await req.json();
  const { metric, valueNum, valueJson, unit, source, deviceId, takenAt } = body || {};
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  if (!metric || (!valueNum && !valueJson) || !takenAt) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const pool = getDbPool();
  const { rows } = await pool.query(
    `insert into health_readings (user_id, metric, value_num, value_json, unit, source, device_id, taken_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
    [userId, metric, valueNum ?? null, valueJson ?? null, unit ?? null, source ?? null, deviceId ?? null, takenAt]
  );
  return NextResponse.json({ id: rows[0].id });
}




