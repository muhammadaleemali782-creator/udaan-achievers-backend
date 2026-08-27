import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cat: { type: String, required: true }, // WCNA Program, Curriculum Books, Clinical Practice
    level: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    seats: { type: String, default: "" },
    rating: { type: Number, default: 4.9 },
    students: { type: String, default: "1,200+" },
    image: { type: String, default: "" },
    tag: { type: String, default: "" },
    desc: { type: String, default: "" },
    lectures: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
