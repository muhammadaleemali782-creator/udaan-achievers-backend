import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";

const router = express.Router();

// ---- Admin login (credentials from .env, no DB user needed) ----
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// ---- Student quick access: enter a Student ID (+ name the first time) ----
// No password needed. If the ID already exists, it just logs them in.
// If it's new, it creates the student record with that ID.
router.post("/student/access", async (req, res) => {
  try {
    const { studentId, name } = req.body;
    if (!studentId) return res.status(400).json({ error: "Student ID is required" });

    let student = await Student.findOne({ studentId: studentId.trim() });

    if (!student) {
      if (!name) return res.status(400).json({ error: "Name is required for a new Student ID" });
      student = await Student.create({ studentId: studentId.trim(), name });
    }

    const token = jwt.sign({ role: "student", id: student._id }, process.env.JWT_SECRET, { expiresIn: "90d" });
    res.json({ token, student: { id: student._id, name: student.name, studentId: student.studentId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Student signup (email + password, optional alternate flow) ----
router.post("/student/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await Student.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, passwordHash });

    const token = jwt.sign({ role: "student", id: student._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Student login ----
router.post("/student/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, student.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ role: "student", id: student._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
