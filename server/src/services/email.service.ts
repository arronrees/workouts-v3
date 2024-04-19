import { emailTransporter } from '../constants';

type EmailVerificationEmailType = {
  email: string;
  id: string;
  name: string;
  randomString: string;
};

async function sendEmailVerification({
  email,
  id,
  name,
  randomString,
}: EmailVerificationEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Verify your email address`,
      html: `
        <p>Hi, <b>${name}.</b> Thanks for joining.</p>
        <p>Please visit this <a href="${process.env.WEB_URL}/user/verify-email/${id}?token=${randomString}" target="_blank" rel="noreferrer">link</a> to verify your email address</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

type EmailVerifiedEmailType = {
  email: string;
  name: string;
};

async function sendEmailVerified({ email, name }: EmailVerifiedEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Email verified`,
      html: `
        <p>Hi, <b>${name}.</b> Thanks for verifying your email address.</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

type PasswordResetEmailType = {
  email: string;
  id: string;
  name: string;
  randomString: string;
};

async function sendPasswordResetEmail({
  email,
  id,
  name,
  randomString,
}: PasswordResetEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Reset Your Password`,
      html: `
        <p>Hi, <b>${name}.</b></p>
        <p>We have received a request to reset your password</p>
        <p>Please visit this <a href="${process.env.WEB_URL}/auth/user/reset-password/${id}?token=${randomString}" target="_blank" rel="noreferrer">link</a> to reset your password.</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

type PasswordNotificationEmailType = {
  email: string;
  name: string;
};

async function sendPasswordUpdateNotification({
  email,
  name,
}: PasswordNotificationEmailType) {
  try {
    const message = await emailTransporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
      to: email,
      subject: `${process.env.SITE_NAME} - Password Updated`,
      html: `
        <p>Hi, <b>${name}.</b></p>
        <p>Your password has been updated.</p>
      `,
    });

    return message;
  } catch (err) {
    console.error(err);

    return null;
  }
}

const emailService = {
  sendEmailVerification,
  sendEmailVerified,
  sendPasswordResetEmail,
  sendPasswordUpdateNotification,
};

export default emailService;
