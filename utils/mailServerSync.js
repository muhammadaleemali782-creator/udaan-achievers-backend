import dns from "dns";
try { dns.setServers(["8.8.8.8", "1.1.1.1"]); } catch(e){}
import mongoose from "mongoose";

const MAIL_MONGO_URI = process.env.MAIL_MONGO_URI || 'mongodb+srv://luciferop36_db_user:atIt54yOD2blC1lI@cluster0.2m4wpyj.mongodb.net/messagesdb?appName=Cluster0';

let mailConn = null;
async function getMailDb() {
  if (!mailConn) {
    mailConn = await mongoose.createConnection(MAIL_MONGO_URI).asPromise();
  }
  return mailConn;
}

export async function syncUserToMailServer({ identifier, displayName, passwordHash, phone = '' }) {
  try {
    const conn = await getMailDb();
    const UserSchema = new mongoose.Schema({
      product: String,
      identifier: String,
      displayName: String,
      passwordHash: String,
      phone: String,
      failedAttempts: { type: Number, default: 0 },
      lockedUntil: { type: Date, default: null }
    });
    const MailUser = conn.models.User || conn.model('User', UserSchema, 'users');

    const cleanId = (identifier || '').trim().toLowerCase();
    await MailUser.findOneAndUpdate(
      { identifier: cleanId },
      {
        product: 'educa',
        identifier: cleanId,
        displayName: displayName || cleanId.split('@')[0],
        passwordHash,
        phone,
        failedAttempts: 0,
        lockedUntil: null
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Synced account to EDUCA Mail: ${cleanId}`);
  } catch (err) {
    console.error('Mail sync notice:', err.message);
  }
}

export async function deliverEmailToMailbox({ from = 'no-reply@educaveda.com', to, subject, body }) {
  try {
    const conn = await getMailDb();
    const zlib = await import('zlib');
    const MessageSchema = new mongoose.Schema({
      product: String,
      from: String,
      to: String,
      ts: { type: Date, default: Date.now },
      subject: Buffer,
      body: Buffer,
      flags: { type: Number, default: 0 }
    });
    const MailMessage = conn.models.Message || conn.model('Message', MessageSchema, 'messages');

    const cleanTo = (to || '').trim().toLowerCase();
    await MailMessage.create({
      product: 'educa',
      from: (from || 'system@educaveda.com').trim().toLowerCase(),
      to: cleanTo,
      subject: zlib.deflateSync(subject || ''),
      body: zlib.deflateSync(body || '')
    });
    console.log(`📨 Delivered mail to EDUCA Mailbox: ${cleanTo}`);
  } catch (err) {
    console.error('Mail delivery notice:', err.message);
  }
}
