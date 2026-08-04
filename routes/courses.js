import express from "express";
import Course from "../models/Course.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Public: list all courses
router.get("/", async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
});

// Public: get one course
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

// Admin: create
router.post("/", adminAuth, async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

// Admin: update
router.put("/:id", adminAuth, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

// Admin: delete
router.delete("/:id", adminAuth, async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ success: true });
});

export default router;
