import nodemailer from "nodemailer";

// Uses your own email account (e.g. Gmail with an "App Password") to send
// password-reset emails. Set EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASS in .env.
// For Gmail: EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=465, EMAIL_USER=you@gmail.com,
// EMAIL_PASS=<16-character App Password from Google Account > Security > App Passwords>
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendPasswordResetEmail(toEmail, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: "Reset your Udaan Achievers password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>You (or someone else) requested a password reset for your Udaan Achievers account.</p>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#0B1F4D;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
