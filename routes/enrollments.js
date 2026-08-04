import express from "express";
import Student from "../models/Student.js";
import { studentAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get logged-in student's profile + enrolled courses
router.get("/me", studentAuth, async (req, res) => {
  const student = await Student.findById(req.student.id).populate("enrolledCourses");
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json({ id: student._id, name: student.name, email: student.email, enrolledCourses: student.enrolledCourses });
});

// Enroll in a course
router.post("/enroll/:courseId", studentAuth, async (req, res) => {
  const student = await Student.findById(req.student.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  if (!student.enrolledCourses.includes(req.params.courseId)) {
    student.enrolledCourses.push(req.params.courseId);
    await student.save();
  }
  res.json({ success: true });
});

export default router;
