import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const UDAAN_MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://muhammadaleemali888_db_user:k6DVmZ7sWT0EykzF@cluster0.nxu5izr.mongodb.net/udaan-achievers?retryWrites=true&w=majority';
const MAIL_MONGO_URI = 'mongodb+srv://luciferop36_db_user:atIt54yOD2blC1lI@cluster0.2m4wpyj.mongodb.net/messagesdb?appName=Cluster0';

async function syncAllUdaanUsers() {
  console.log('Connecting to Udaan and Mail databases...');
  const udaanConn = await mongoose.createConnection(UDAAN_MONGO_URI).asPromise();
  const mailConn = await mongoose.createConnection(MAIL_MONGO_URI).asPromise();

  const Student = udaanConn.model('Student', new mongoose.Schema({}, { strict: false }), 'students');
  const MailUser = mailConn.model('User', new mongoose.Schema({
    product: String, identifier: String, displayName: String, passwordHash: String, phone: String, failedAttempts: Number, lockedUntil: Date
  }), 'users');

  const students = await Student.find({}).lean();
  console.log(`Found ${students.length} students/admins in Udaan Achievers.`);

  let count = 0;
  for (const s of students) {
    if (!s.passwordHash) continue;
    const name = s.name || s.studentId || 'Student';

    // Sync studentId
    if (s.studentId) {
      await MailUser.findOneAndUpdate(
        { identifier: s.studentId.trim().toLowerCase() },
        { product: 'educa', identifier: s.studentId.trim().toLowerCase(), displayName: name, passwordHash: s.passwordHash, failedAttempts: 0, lockedUntil: null },
        { upsert: true, new: true }
      );
      count++;
    }

    // Sync email
    if (s.email) {
      await MailUser.findOneAndUpdate(
        { identifier: s.email.trim().toLowerCase() },
        { product: 'educa', identifier: s.email.trim().toLowerCase(), displayName: name, passwordHash: s.passwordHash, failedAttempts: 0, lockedUntil: null },
        { upsert: true, new: true }
      );
      count++;
    }
  }

  console.log(`✅ Successfully synced ${count} Udaan identities into EDUCA Mail!`);
  await udaanConn.close();
  await mailConn.close();
  process.exit(0);
}

syncAllUdaanUsers().catch(err => {
  console.error('Udaan sync error:', err);
  process.exit(1);
});
