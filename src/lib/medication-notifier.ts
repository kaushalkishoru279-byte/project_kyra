import * as cron from 'node-cron';
import { getDbPool } from './db';
import { sendEmail } from './notifier';

export class MedicationNotifier {
  private static isRunning = false;
  private static isSending = false;

  static start() {
    if (this.isRunning) {
      console.log('Medication notifier already running');
      return;
    }
    this.isRunning = true;
    console.log('Starting medication notifier...');

    // Every minute, check for reminders due within next 5 minutes
    cron.schedule('* * * * *', async () => {
      await this.runOnce();
    });

    // Optionally, run shortly after startup in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => this.runOnce().catch(() => {}), 5000);
    }

    console.log('Medication notifier started');
  }

  static stop() {
    if (!this.isRunning) {
      console.log('Medication notifier not running');
      return;
    }
    cron.destroy();
    this.isRunning = false;
    console.log('Medication notifier stopped');
  }

  static async runOnce() {
    if (this.isSending) return;
    this.isSending = true;
    const pool = getDbPool();
    try {
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
          // continue on error
        }
      }
      if (rows.length > 0) {
        console.log(`Medication notifier processed ${rows.length}, sent ${sent}`);
      }
    } catch (error) {
      console.error('Medication notifier error:', error);
    } finally {
      this.isSending = false;
    }
  }
}




