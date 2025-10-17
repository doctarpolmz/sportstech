import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || 'SportsTech AI <no-reply@sportstech.ai>';
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[DEV EMAIL] To:', to, 'Subject:', subject); 
    console.log(html);
    return { dev: true };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter.sendMail({ from, to, subject, html });
}
