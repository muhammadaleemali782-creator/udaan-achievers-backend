import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, default: "" },
    teacher: { type: String, default: "" },
    tag: { type: String, enum: ["JEE", "NEET", "Foundation"], default: "JEE" },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
