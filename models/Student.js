import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true }, // the ID the user logs in with
    email: { type: String, required: true },
    educaEmail: { type: String, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
