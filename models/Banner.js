import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // image URL
    title: { type: String, default: "" },
    link: { type: String, default: "" }, // where clicking the banner goes, e.g. /courses
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
