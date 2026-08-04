import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true }, // simple ID the student picks/remembers, e.g. phone number or roll number
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
