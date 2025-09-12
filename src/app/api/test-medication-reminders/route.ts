import { NextRequest, NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const pool = getDbPool();
  
  try {
    // Create a test medication
    const { rows: medRows } = await pool.query(
      `INSERT INTO public.medications (id, user_id, name, dosage, frequency, instructions, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), 'demo-user', 'Test Medication', '10mg', 'Once daily', 'Take with food', true, NOW(), NOW())
       RETURNING id`
    );
    const medicationId = medRows[0].id;

    // Create a test schedule for today at 2 PM
    const today = new Date();
    today.setHours(14, 0, 0, 0); // 2:00 PM today
    
    const { rows: scheduleRows } = await pool.query(
      `INSERT INTO public.medication_schedules (id, user_id, medication_id, start_date, end_date, times, days_of_week, timezone, created_at, updated_at)
       VALUES (gen_random_uuid(), 'demo-user', $1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id`,
      [medicationId, today.toISOString(), null, [today.toTimeString().slice(0, 5)], [today.getDay()], 'UTC']
    );
    const scheduleId = scheduleRows[0].id;

    // Create a test reminder for today
    const { rows: reminderRows } = await pool.query(
      `INSERT INTO public.medication_reminders (id, schedule_id, due_at, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 'pending', NOW(), NOW())
       RETURNING id`,
      [scheduleId, today.toISOString()]
    );

    // Create a test reminder for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { rows: tomorrowReminderRows } = await pool.query(
      `INSERT INTO public.medication_reminders (id, schedule_id, due_at, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 'pending', NOW(), NOW())
       RETURNING id`,
      [scheduleId, tomorrow.toISOString()]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Test medication and reminders created',
      medicationId,
      scheduleId,
      reminders: [reminderRows[0].id, tomorrowReminderRows[0].id]
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({ error: 'Failed to create test data' }, { status: 500 });
  }
}


