import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import batchRoutes from "./routes/batches.js";
import testimonialRoutes from "./routes/testimonials.js";
import statRoutes from "./routes/stats.js";
import siteInfoRoutes from "./routes/siteInfo.js";
import enrollmentRoutes from "./routes/enrollments.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Udaan Achievers API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/site-info", siteInfoRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
