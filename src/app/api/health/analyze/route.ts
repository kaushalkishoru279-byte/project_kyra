import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, ensureHealthTables } from '@/lib/db';
import { analyzeHealthData } from '@/ai/flows/health-anomaly-analyzer';

function getUserId(req: NextRequest): string | null { return req.headers.get('x-user-id'); }

export async function POST(req: NextRequest) {
  await ensureHealthTables();
  const userId = getUserId(req);
  const { windowMinutes = 60 } = await req.json();
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 });
  const pool = getDbPool();
  const { rows } = await pool.query(
    `select metric, value_num, value_json, unit, taken_at
     from health_readings
     where user_id = $1 and taken_at >= now() - ($2 || ' minutes')::interval
     order by taken_at desc`,
    [userId, windowMinutes]
  );

  // Simple feature extraction for BP and HR
  const latestHr = rows.find(r => r.metric === 'heart_rate')?.value_num;
  const latestBp = rows.find(r => r.metric === 'blood_pressure')?.value_json as { systolic?: number; diastolic?: number } | undefined;
  const bloodPressureStr = latestBp ? `${latestBp.systolic ?? ''}/${latestBp.diastolic ?? ''}` : '';

  if (!latestHr && !latestBp) {
    return NextResponse.json({ warning: 'No recent readings' }, { status: 200 });
  }

  const aiResult = await analyzeHealthData({
    bloodPressure: bloodPressureStr || 'unknown',
    heartRate: Number(latestHr ?? 0),
    additionalNotes: 'Automated analysis from recent readings',
  });

  // Rules engine (thresholds and quick ROC)
  const hrSeries = rows.filter(r => r.metric === 'heart_rate').slice(0, 5).reverse();
  const bpSeries = rows.filter(r => r.metric === 'blood_pressure').slice(0, 5).reverse();
  const rules: { id: string; level: 'info'|'warn'|'critical'; message: string }[] = [];
  if (typeof latestHr === 'number') {
    if (latestHr < 50) rules.push({ id: 'hr_low', level: 'warn', message: `Low heart rate: ${latestHr} BPM` });
    if (latestHr > 110) rules.push({ id: 'hr_high', level: 'warn', message: `High heart rate: ${latestHr} BPM` });
    if (hrSeries.length >= 3) {
      const first = hrSeries[0].value_num as number;
      const last = hrSeries[hrSeries.length - 1].value_num as number;
      if (last - first > 30) rules.push({ id: 'hr_spike', level: 'critical', message: `Rapid HR increase: +${Math.round(last - first)} BPM` });
    }
  }
  if (latestBp && typeof latestBp.systolic === 'number' && typeof latestBp.diastolic === 'number') {
    const { systolic, diastolic } = latestBp;
    if (systolic >= 140 || diastolic >= 90) rules.push({ id: 'bp_stage2', level: 'critical', message: `Stage 2 hypertension suspected: ${systolic}/${diastolic}` });
    else if (systolic >= 130 || diastolic >= 80) rules.push({ id: 'bp_stage1', level: 'warn', message: `Stage 1 hypertension range: ${systolic}/${diastolic}` });
  }

  return NextResponse.json({ ai: aiResult, rules });
}


