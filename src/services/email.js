const nodemailer = require('nodemailer');

let transporter = null;
let etherealUrl = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.verify();
    console.log('  ✓ Email transporter ready (SMTP)');
  } else if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    transporter = { resend, isResend: true };
    console.log('  ✓ Email transporter ready (Resend API)');
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    etherealUrl = 'https://ethereal.email/login';
    console.log(`  ✓ Ethereal email ready — ${testAccount.user}`);
  }
  return transporter;
}

const FROM = process.env.EMAIL_FROM || 'MentallyPrepare <noreply@mentallyprepare.app>';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';

function wrapHtml(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#08050F; font-family:Georgia,serif; color:#F8F2FF; }
  .container { max-width:480px; margin:0 auto; padding:32px 24px; }
  .logo { text-align:center; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:rgba(248,242,255,0.35); margin-bottom:32px; }
  .card { background:#0E0A18; border:1px solid rgba(248,242,255,0.07); border-radius:20px; padding:24px; }
  .btn { display:inline-block; background:#9B4F66; color:#fff; text-decoration:none; padding:14px 28px; border-radius:100px; font-size:14px; letter-spacing:0.5px; }
  .footer { text-align:center; color:rgba(248,242,255,0.35); font-size:11px; margin-top:32px; }
  p { color:rgba(248,242,255,0.62); font-size:14px; line-height:22px; }
</style></head><body>
<div class="container">
<div class="logo">✦ Mentally Prepare</div>
<div class="card">${body}</div>
<div class="footer">— MentallyPrepare</div>
</div></body></html>`;
}

async function sendPasswordReset(email, token) {
  const t = await getTransporter();
  const resetLink = `${BASE_URL}/reset-password?code=${token}`;
  const deepLink = `mentallyprepare://reset-password?code=${token}`;
  const html = wrapHtml(`
    <h2 style="font-family:Georgia,serif;font-weight:400;font-size:22px;margin:0 0 16px;color:#EBB4C2;">Reset your password</h2>
    <p>Click below to reset your password. This link expires in 15 minutes.</p>
    <p style="text-align:center;margin:24px 0;"><a href="${resetLink}" class="btn">Reset password</a></p>
    <p style="font-size:12px;">Or copy this link: <a href="${resetLink}" style="color:#896cb5;word-break:break-all;">${resetLink}</a></p>
    <p style="font-size:12px;">App deep link: <a href="${deepLink}" style="color:#896cb5;">Open in app</a></p>
  `);

  if (t.isResend) {
    const { error } = await t.resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Reset your MentallyPrepare password',
      html,
    });
    if (error) throw error;
    return;
  }

  const info = await t.sendMail({ from: FROM, to: email, subject: 'Reset your MentallyPrepare password', html, text: `Reset your password here: ${resetLink}\n\nThis link expires in 15 minutes.` });
  if (etherealUrl) console.log(`  ✉ Preview: ${nodemailer.getTestMessageUrl(info)}`);
  return info;
}

async function sendNotificationEmail(email, subject, body) {
  const t = await getTransporter();
  const html = wrapHtml(`<p>${body.replace(/\n/g, '<br>')}</p>`);

  if (t.isResend) {
    const { error } = await t.resend.emails.send({
      from: FROM,
      to: email,
      subject: `MentallyPrepare — ${subject}`,
      html,
    });
    if (error) throw error;
    return;
  }

  const info = await t.sendMail({ from: FROM, to: email, subject: `MentallyPrepare — ${subject}`, html, text: body });
  if (etherealUrl) console.log(`  ✉ Notification preview: ${nodemailer.getTestMessageUrl(info)}`);
  return info;
}

module.exports = { sendPasswordReset, sendNotificationEmail };
