import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.SMTP_FROM || 'no-reply@sportstechai.local';
  await mailer.sendMail({ from, to, subject, html });
}
