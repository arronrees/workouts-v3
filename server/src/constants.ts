import { createTransport } from 'nodemailer';

export const __in_production = process.env.NODE_ENV === 'production';

export const emailTransporter = createTransport({
  host: process.env.SMTP_HOST_NAME,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
