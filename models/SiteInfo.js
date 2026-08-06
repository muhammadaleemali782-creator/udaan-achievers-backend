import mongoose from "mongoose";

const siteInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: "contact", unique: true },
    phone: { type: String, default: "+91 98765 43210" },
    email: { type: String, default: "hello@udaanachievers.in" },
    address: { type: String, default: "Civil Lines, Kanpur, Uttar Pradesh" },
    heroBadge: { type: String, default: "Admissions open · Batch starts 18 Aug" },
    heroTitleLine1: { type: String, default: "Your rank isn't luck." },
    heroTitleLine2: { type: String, default: "It's a" },
    heroTitleHighlight: { type: String, default: "timetable" },
    heroTitleLine3: { type: String, default: "you kept." },
    heroSubtitle: { type: String, default: "Live classes, weekly tests and doubt support for JEE, NEET and board exams." },
    heroImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SiteInfo", siteInfoSchema);
