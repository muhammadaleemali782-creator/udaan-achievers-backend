import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {"dns"} from "dns";
import {"connectDB"} from "./config/db.js";
import Course from "./models/Course.js";
import Batch from "./models/Batch.js";
import Testimonial from "./models/Testimonial.js";
import Stat from "./models/Stat.js";
import SiteInfo from "./models/SiteInfo.js";
import Banner from "./models/Banner.js";
import Student from "./models/Student.js";
import mongoose from "mongoose";

dotenv.config();

const courses = [
  {
    "name": "WCNA \u2014 Wellness Consultancy of Naturopathy & Ayurveda",
    "cat": "WCNA Program",
    "level": "18 Months + 6 Mo Internship",
    "price": 24999,
    "oldPrice": 35000,
    "seats": "Admissions Open",
    "rating": 5.0,
    "students": "540 enrolled",
    "image": "/books/wcna_master_course.jpg",
    "tag": "CAREER FOCUSED TRAINING",
    "desc": "Complete 18-Month career focused training course in Wellness Consultancy of Naturopathy & Ayurveda with 6-month internship, personal guidance, and clinical case studies.",
    "lectures": [
      "Anatomy & Physiology",
      "Rogshashtra",
      "Principal of Ayurveda",
      "Principal of Naturopathy",
      "Diet & Nutrition",
      "Yoga Science",
      "Counselling Skills",
      "Objection & Solution",
      "Client Follow Up",
      "Wellness Center Setup",
      "20+ Wellness Case Studies"
    ]
  },
  {
    "name": "WCNA: Wellness Coaching (BOOK 01)",
    "cat": "Curriculum Books",
    "level": "Book 01",
    "price": 499,
    "oldPrice": 799,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book1_wellness_coaching.jpg",
    "tag": "FOUNDATION",
    "desc": "Essential introduction to modern wellness coaching, client mindset transformation, and holistic health philosophy.",
    "lectures": [
      "Holistic Health Principles",
      "Client Mindset Shifts",
      "Goal Setting",
      "Wellness Dimensions"
    ]
  },
  {
    "name": "WCNA: Naturopathy Basics (BOOK 02)",
    "cat": "Curriculum Books",
    "level": "Book 02",
    "price": 549,
    "oldPrice": 849,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book2_naturopathy_basics.jpg",
    "tag": "NATURE CURE",
    "desc": "Core principles of Naturopathic healing, 5 elements therapy, hydrotherapy, mud packs, and natural body detoxification.",
    "lectures": [
      "5 Elements Therapy",
      "Hydrotherapy",
      "Mud Therapy",
      "Fasting & Detoxification"
    ]
  },
  {
    "name": "WCNA: Ayurveda Basics (BOOK 03)",
    "cat": "Curriculum Books",
    "level": "Book 03",
    "price": 599,
    "oldPrice": 899,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book3_ayurveda_basics.jpg",
    "tag": "ANCIENT WISDOM",
    "desc": "Foundational Ayurvedic concepts: Vata, Pitta, Kapha assessment, Agni, Ama diagnostics, and body constitution analysis.",
    "lectures": [
      "Tridosha Analysis",
      "Dhatu & Mala Science",
      "Prakriti Assessment",
      "Agni & Ama Diagnostics"
    ]
  },
  {
    "name": "WCNA: Client Assessment (BOOK 05)",
    "cat": "Curriculum Books",
    "level": "Book 05",
    "price": 649,
    "oldPrice": 949,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book5_client_assessment.jpg",
    "tag": "CLINICAL PRACTICE",
    "desc": "Comprehensive framework for evaluating client medical history, physical symptoms, stress markers, and lifestyle assessment.",
    "lectures": [
      "Health Intake Forms",
      "Nadi & Tongue Observation",
      "Vital Marker Analysis",
      "Lifestyle Stress Auditing"
    ]
  },
  {
    "name": "WCNA: Diet Planning (BOOK 06)",
    "cat": "Curriculum Books",
    "level": "Book 06",
    "price": 599,
    "oldPrice": 899,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book6_diet_planning.jpg",
    "tag": "NUTRITION",
    "desc": "Scientific diet design combining Ahara principles, sattvic nutrition, calorie balance, and customized disease meal charts.",
    "lectures": [
      "Ahara Vidhi",
      "Sattvic Nutrition",
      "Therapeutic Diet Charts",
      "Calorie & Micro-nutrient Balance"
    ]
  },
  {
    "name": "WCNA: Lifestyle & Routine (BOOK 07)",
    "cat": "Curriculum Books",
    "level": "Book 07",
    "price": 499,
    "oldPrice": 799,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book7_lifestyle_coaching.jpg",
    "tag": "DAILY HABITS",
    "desc": "Step-by-step coaching tools for sleep optimization, morning rituals, stress reduction, and habit formation.",
    "lectures": [
      "Dinacharya Protocol",
      "Circadian Rhythm Biology",
      "Sleep Architecture",
      "Stress & Breathwork"
    ]
  },
  {
    "name": "WCNA: Managing Diseases (BOOK 08)",
    "cat": "Clinical Practice",
    "level": "Book 08",
    "price": 749,
    "oldPrice": 1099,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book8_managing_diseases.jpg",
    "tag": "REVERSAL PROTOCOLS",
    "desc": "Proven holistic protocols for managing Diabetes, Hypertension, Thyroid imbalances, PCOD, and Digestive disorders.",
    "lectures": [
      "Metabolic Syndrome",
      "Hypertension Protocols",
      "Thyroid Management",
      "Gut & Acid Reflux Protocols"
    ]
  },
  {
    "name": "WCNA: Herbs & Supplements (BOOK 09)",
    "cat": "Clinical Practice",
    "level": "Book 09",
    "price": 699,
    "oldPrice": 999,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book9_herbs_supplements.jpg",
    "tag": "HERBOLOGY",
    "desc": "Practical guide to potent medicinal herbs, classical formulations, safe dosages, contraindications, and supplement pairing.",
    "lectures": [
      "Classical Formulations",
      "Herb Synergy & Anupana",
      "Dosage & Toxicity Safety",
      "Modern Supplement Pairings"
    ]
  },
  {
    "name": "WCNA: Communication Skills (BOOK 10)",
    "cat": "Clinical Practice",
    "level": "Book 10",
    "price": 599,
    "oldPrice": 899,
    "seats": "Instant Access",
    "rating": 4.9,
    "students": "320+ copies",
    "image": "/books/book10_client_communication.jpg",
    "tag": "CONSULTANCY PRACTICE",
    "desc": "Advanced consulting psychology, overcoming client objections, long-term retention, and establishing a successful wellness center.",
    "lectures": [
      "Counseling Psychology",
      "Objection Handling",
      "Client Retention System",
      "Wellness Center Setup"
    ]
  }
];

const batches = [
  { time: "07:00 AM", subject: "Anatomy & Physiology", topic: "Skeletal & Muscular Foundations", teacher: "Dr. A. Sharma", tag: "WCNA" },
  { time: "09:00 AM", subject: "Principal of Ayurveda", topic: "Tridosha & Prakriti Assessment", teacher: "Vaidya N. Iyer", tag: "AYURVEDA" },
  { time: "11:00 AM", subject: "Principal of Naturopathy", topic: "Panchamahabhuta & Hydrotherapy", teacher: "Dr. R. Verma", tag: "NATUROPATHY" },
  { time: "01:00 PM", subject: "Diet & Nutrition", topic: "Ahara Vidhi & Therapeutic Meal Charts", teacher: "D. Kulkarni", tag: "NUTRITION" },
  { time: "03:00 PM", subject: "Counselling & Case Study", topic: "Clinical Intake & Wellness Center Setup", teacher: "Dr. P. Nair", tag: "CONSULTANCY" },
];

const testimonials = [
  { name: "Dr. Ritika Solanki", exam: "Certified Wellness Consultant (WCNA 2026)", text: "The 18-month curriculum and practical clinical internship gave me complete confidence to start my own Naturopathy center." },
  { name: "Aman Khatri", exam: "Holistic Diet & Ayurveda Coach", text: "Book 1 to 10 cover every single real-world client situation, from diet charts to herbal dosages." },
  { name: "Simran Kaur", exam: "Lifestyle Disease Reversal Specialist", text: "1:1 mentorship and marathon classes helped me successfully handle over 50+ client consultations." },
];

const stats = [
  { value: "18 Months", label: "Comprehensive Program" },
  { value: "10 Books", label: "Official Curriculum Books" },
  { value: "20+", label: "Clinical Case Studies" },
  { value: "100%", label: "Verified Certification" },
];

async function run() {
  await connectDB();

  await Promise.all([
    Course.deleteMany({}),
    Batch.deleteMany({}),
    Testimonial.deleteMany({}),
    Stat.deleteMany({}),
  ]);

  await Course.insertMany(courses);
  await Batch.insertMany(batches);
  await Testimonial.insertMany(testimonials);
  await Stat.insertMany(stats);
  await SiteInfo.findOneAndUpdate({ key: "contact" }, { key: "contact" }, { upsert: true });

  // Admin Account check
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const existingAdmin = await Student.findOne({ studentId: adminUser });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
    await Student.create({
      studentId: adminUser,
      passwordHash,
      email: process.env.ADMIN_EMAIL || "admin@educaveda.com",
      educaEmail: "admin@educaveda.com",
      name: "Faculty Admin",
      role: "admin",
    });
    console.log(`Admin account ready — ID: ${adminUser}`);
  }

  console.log("✅ Udaan Achievers Database seeded with WCNA Curriculum & Books!");
  mongoose.connection.close();
}

run().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
