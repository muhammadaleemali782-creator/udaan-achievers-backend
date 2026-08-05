import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Student from "../models/Student.js";
import { sendPasswordResetEmail } from "../utils/email.js";

const router = express.Router();

// ---- Sign up: anyone can create a new ID + password. Always creates a
// regular "student" account — admin accounts are only made via the seed
// script, never through public signup. ----
router.post("/signup", async (req, res) => {
  try {
    const { studentId, password, email, name } = req.body;
    if (!studentId || !password || !email || !name) {
      return res.status(400).json({ error: "ID, password, email aur naam sab zaroori hain" });
    }

    const existing = await Student.findOne({ studentId: studentId.trim() });
    if (existing) return res.status(409).json({ error: "Ye ID pehle se use ho rahi hai" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await Student.create({
      studentId: studentId.trim(),
      passwordHash,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: "student",
    });

    const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: "90d" });
    res.status(201).json({ role: user.role, token, user: { id: user._id, name: user.name, studentId: user.studentId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Log in with ID + password. Works for both students and admin —
// the account's role (set in the database) decides what they see. ----
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) return res.status(400).json({ error: "ID aur password dono daalo" });

    const user = await Student.findOne({ studentId: studentId.trim() });
    if (!user) return res.status(401).json({ error: "Galat ID ya password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Galat ID ya password" });

    const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: "90d" });
    res.json({ role: user.role, token, user: { id: user._id, name: user.name, studentId: user.studentId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Forgot password: send a reset link to the account's email ----
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email daalo" });

    const user = await Student.findOne({ email: email.trim().toLowerCase() });
    // Always respond success even if not found, so people can't probe which emails exist.
    if (!user) return res.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, token);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Email bhejne me dikkat hui, thodi der baad try karo" });
  }
});

// ---- Reset password using the token from the emailed link ----
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

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
