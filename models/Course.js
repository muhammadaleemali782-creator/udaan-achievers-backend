import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cat: { type: String, enum: ["JEE", "NEET", "Foundation"], required: true },
    level: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    seats: { type: String, default: "" },
    rating: { type: Number, default: 4.5 },
    students: { type: String, default: "0" },
    desc: { type: String, default: "" },
    lectures: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
