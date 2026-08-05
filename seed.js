import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Course from "./models/Course.js";
import Batch from "./models/Batch.js";
import Testimonial from "./models/Testimonial.js";
import Stat from "./models/Stat.js";
import SiteInfo from "./models/SiteInfo.js";
import Student from "./models/Student.js";
import mongoose from "mongoose";

dotenv.config();

const courses = [
  { name: "JEE Elite 2027", cat: "JEE", level: "Class 11-12", price: 42000, oldPrice: 58000, seats: "180 seats left", rating: 4.8, students: "12,400", desc: "Full syllabus coverage with 3 mock tests every month and doubt-clearing within 24 hours.", lectures: ["Kinematics Basics", "Laws of Motion", "Rotational Motion", "Thermodynamics"] },
  { name: "NEET Ascend 2027", cat: "NEET", level: "Class 11-12", price: 39000, oldPrice: 52000, seats: "220 seats left", rating: 4.9, students: "15,800", desc: "NCERT-first teaching with weekly biology diagrams practice and OMR-based testing.", lectures: ["Cell Structure", "Human Reproduction", "Genetics Basics", "Plant Kingdom"] },
  { name: "JEE Crash Course", cat: "JEE", level: "Class 12 / Drop", price: 15000, oldPrice: 21000, seats: "95 seats left", rating: 4.6, students: "6,700", desc: "60-day revision sprint with previous-year paper drills and formula sheets.", lectures: ["Formula Sheet Physics", "Formula Sheet Maths"] },
  { name: "NEET Biology Sprint", cat: "NEET", level: "Class 12 / Drop", price: 9500, oldPrice: 13000, seats: "140 seats left", rating: 4.8, students: "8,100", desc: "Diagram-heavy biology revision built around 15 years of NEET question patterns.", lectures: ["Diagram Practice 1", "Diagram Practice 2"] },
  { name: "Class 12 Board Mastery", cat: "Foundation", level: "Class 12", price: 14000, oldPrice: 19000, seats: "150 seats left", rating: 4.7, students: "7,400", desc: "Board-focused revision with sample papers and marking-scheme practice for Class 12.", lectures: ["Electrostatics Revision", "Organic Chemistry Revision"] },
  { name: "Class 11 Foundation", cat: "Foundation", level: "Class 11", price: 13000, oldPrice: 18000, seats: "190 seats left", rating: 4.6, students: "6,900", desc: "Builds the base for Class 11 Science and Maths before stepping into JEE/NEET batches.", lectures: ["Sets and Functions", "Mechanics Basics"] },
  { name: "Class 10 Board Mastery", cat: "Foundation", level: "Class 10", price: 12000, oldPrice: 16000, seats: "260 seats left", rating: 4.7, students: "11,300", desc: "Chapter-wise tests aligned to board marking schemes with sample-paper practice.", lectures: ["Chemical Reactions", "Life Processes"] },
  { name: "Class 9 Foundation Builder", cat: "Foundation", level: "Class 9", price: 11000, oldPrice: 15000, seats: "230 seats left", rating: 4.7, students: "8,500", desc: "Builds core concept strength in Science and Maths for board and future competitive exams.", lectures: ["Number Systems", "Motion Basics", "Atoms and Molecules"] },
  { name: "Class 8 Achiever", cat: "Foundation", level: "Class 8", price: 8000, oldPrice: 11000, seats: "300 seats left", rating: 4.6, students: "6,200", desc: "Strengthens Maths and Science fundamentals with weekly practice worksheets.", lectures: ["Rational Numbers", "Force and Pressure"] },
  { name: "Class 7 Achiever", cat: "Foundation", level: "Class 7", price: 7500, oldPrice: 10000, seats: "280 seats left", rating: 4.6, students: "5,100", desc: "Builds strong basics in Maths and Science with fun, concept-first teaching.", lectures: ["Integers", "Heat Basics"] },
  { name: "Class 6 Achiever", cat: "Foundation", level: "Class 6", price: 7000, oldPrice: 9500, seats: "310 seats left", rating: 4.5, students: "4,800", desc: "Introduces Maths and Science fundamentals with simple, everyday examples.", lectures: ["Knowing Numbers", "Food: Where Does It Come From"] },
  { name: "Class 3-5 Primary Learning", cat: "Foundation", level: "Class 3-5", price: 5500, oldPrice: 7500, seats: "350 seats left", rating: 4.6, students: "5,600", desc: "Playful, activity-based learning for Maths, English and EVS at the primary level.", lectures: ["Numbers Fun", "My Family and Me"] },
  { name: "Class 1-2 Early Learners", cat: "Foundation", level: "Class 1-2", price: 4500, oldPrice: 6000, seats: "400 seats left", rating: 4.7, students: "3,900", desc: "Foundational literacy and numeracy taught through stories, songs and simple games.", lectures: ["Letters and Sounds", "Counting Fun"] },
];

const batches = [
  { time: "07:00 AM", subject: "Physics", topic: "Rotational Motion", teacher: "A. Sharma", tag: "JEE" },
  { time: "09:00 AM", subject: "Biology", topic: "Human Reproduction", teacher: "N. Iyer", tag: "NEET" },
  { time: "11:00 AM", subject: "Chemistry", topic: "Chemical Bonding", teacher: "R. Verma", tag: "JEE" },
  { time: "01:00 PM", subject: "Mathematics", topic: "Definite Integrals", teacher: "S. Kulkarni", tag: "JEE" },
  { time: "03:00 PM", subject: "Botany", topic: "Plant Kingdom", teacher: "P. Nair", tag: "NEET" },
];

const testimonials = [
  { name: "Ritika Solanki", exam: "AIR 412, JEE Advanced 2026", text: "The daily live batch ticker kept me disciplined — I always knew what to study and when." },
  { name: "Aman Khatri", exam: "AIR 88, NEET UG 2026", text: "Biology diagrams practice every week made recall automatic in the exam hall." },
  { name: "Simran Kaur", exam: "Class 10, 97.2%", text: "The Foundation Builder course made concepts click instead of just memorising formulas." },
];

const stats = [
  { value: "2.4L+", label: "Students taught" },
  { value: "1,200+", label: "Selections in top 1000" },
  { value: "180+", label: "Expert faculty" },
  { value: "4.8/5", label: "Average batch rating" },
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

  // Create the one admin account if it doesn't already exist
  const existingAdmin = await Student.findOne({ studentId: process.env.ADMIN_USERNAME });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Student.create({
      studentId: process.env.ADMIN_USERNAME,
      passwordHash,
      email: process.env.ADMIN_EMAIL,
      name: "Admin",
      role: "admin",
    });
    console.log(`Admin account created — ID: ${process.env.ADMIN_USERNAME}`);
  } else {
    console.log("Admin account already exists, skipped.");
  }

  console.log("Database seeded successfully");
  mongoose.connection.close();
}

run();
