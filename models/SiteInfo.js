import mongoose from "mongoose";

const siteInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: "contact", unique: true },
    phone: { type: String, default: "+91 98765 43210" },
    email: { type: String, default: "admissions@educaveda.com" },
    address: { type: String, default: "EDUCA VEDA Campus, New Delhi / Kanpur" },
    heroBadge: { type: String, default: "🪔 GURUKUL · Admissions Open for WCNA 2026-2027" },
    heroTitleLine1: { type: String, default: "Ancient Gurukul Wisdom" },
    heroTitleLine2: { type: String, default: "Meets Modern" },
    heroTitleHighlight: { type: String, default: "Wellness Science" },
    heroTitleLine3: { type: String, default: "· WCNA Diploma" },
    heroSubtitle: { type: String, default: "Official 18-Month Career Focused Training Course in Naturopathy & Ayurveda with 10 Comic-Illustrated Curriculum Manuals, 20+ Case Studies, and 6-Month Clinical Internship." },
    heroImage: { type: String, default: "/books/wcna_master_course.jpg" },
  },
  { timestamps: true }
);

export default mongoose.model("SiteInfo", siteInfoSchema);
