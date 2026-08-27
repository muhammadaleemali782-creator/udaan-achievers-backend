import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Student from "../models/Student.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { syncUserToMailServer } from "../utils/mailServerSync.js";

const router = express.Router();

// ---- Sign up ----
router.post("/signup", async (req, res) => {
  try {
    const { studentId, password, email, name } = req.body;
    if (!studentId || !password || !name) {
      return res.status(400).json({ error: "ID, password aur naam sab zaroori hain" });
    }

    const cleanId = studentId.trim().toLowerCase();
    const existing = await Student.findOne({ 
      $or: [{ studentId: cleanId }, { studentId: studentId.trim() }] 
    });
    if (existing) return res.status(409).json({ error: "Ye ID pehle se use ho rahi hai" });

    // Official @educaveda.com email format
    const officialEducaEmail = cleanId.includes('@') ? cleanId : `${cleanId}@educaveda.com`;
    const userRecoveryEmail = email ? email.trim().toLowerCase() : officialEducaEmail;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await Student.create({
      studentId: cleanId,
      passwordHash,
      email: userRecoveryEmail,
      educaEmail: officialEducaEmail,
      name: name.trim(),
      role: "student",
    });

    // Auto-sync to EDUCA Mail
    syncUserToMailServer({ identifier: cleanId, displayName: user.name, passwordHash });
    syncUserToMailServer({ identifier: officialEducaEmail, displayName: user.name, passwordHash });

    const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "90d" });
    res.status(201).json({ 
      role: user.role, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        studentId: user.studentId,
        educaEmail: officialEducaEmail 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Log in ----
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) return res.status(400).json({ error: "ID aur password dono daalo" });

    const cleanId = studentId.trim().toLowerCase();
    const user = await Student.findOne({
      $or: [
        { studentId: cleanId },
        { studentId: studentId.trim() },
        { email: cleanId },
        { educaEmail: cleanId }
      ]
    });
    if (!user) return res.status(401).json({ error: "Galat ID ya password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Galat ID ya password" });

    const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "90d" });
    res.json({ 
      role: user.role, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        studentId: user.studentId,
        educaEmail: user.educaEmail || `${user.studentId}@educaveda.com`
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Forgot password ----
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email daalo" });

    const user = await Student.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, token);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Email bhejne me dikkat hui, thodi der baad try karo" });
  }
});

// ---- Reset password ----
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token aur naya password zaroori hai" });

    const user = await Student.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: "Link expire ho gaya hai ya galat hai, dubara try karo" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    syncUserToMailServer({ identifier: user.studentId, displayName: user.name, passwordHash: user.passwordHash });
    syncUserToMailServer({ identifier: user.email, displayName: user.name, passwordHash: user.passwordHash });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
