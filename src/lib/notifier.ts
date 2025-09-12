import nodemailer from 'nodemailer';

export type SendParams = { to: string; subject: string; text?: string; html?: string };

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === '1';
  if (!host || !user || !pass) throw new Error('SMTP env vars missing');
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export async function sendEmail(params: SendParams): Promise<void> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  const transporter = getTransport();
  await transporter.sendMail({ from, ...params });
}




