import mongoose from "mongoose";

const siteInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: "contact", unique: true },
    phone: { type: String, default: "+91 98765 43210" },
    email: { type: String, default: "hello@udaanachievers.in" },
    address: { type: String, default: "Civil Lines, Kanpur, Uttar Pradesh" },
  },
  { timestamps: true }
);

export default mongoose.model("SiteInfo", siteInfoSchema);
