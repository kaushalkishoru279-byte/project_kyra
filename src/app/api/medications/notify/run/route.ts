import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { sendEmail } from '@/lib/notifier';

export async function POST() {
  const pool = getDbPool();
  // Find due reminders in the next 5 minutes that are pending
  const { rows } = await pool.query(`
    select r.id as reminder_id, r.due_at, s.user_id, s.medication_id, m.name as med_name
    from public.medication_reminders r
    join public.medication_schedules s on s.id = r.schedule_id
    join public.medications m on m.id = s.medication_id
    where r.status = 'pending' and r.due_at <= now() + interval '5 minutes'
  `);
  let sent = 0;
  for (const r of rows) {
    const to = process.env.NOTIFY_EMAIL_TO || 'test@example.com';
    try {
      await sendEmail({
        to,
        subject: `Medication Reminder: ${r.med_name}`,
        text: `Time to take ${r.med_name} at ${new Date(r.due_at).toLocaleString()}.`,
      });
      await pool.query(`update public.medication_reminders set status='sent', sent_at=now() where id=$1`, [r.reminder_id]);
      sent++;
    } catch (e) {
      // keep going on error; in production, log to monitoring
    }
  }
  return NextResponse.json({ processed: rows.length, sent });
}


