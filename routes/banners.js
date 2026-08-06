import express from "express";
import Banner from "../models/Banner.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
  res.json(banners);
});

router.post("/", adminAuth, async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

router.put("/:id", adminAuth, async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) return res.status(404).json({ error: "Banner not found" });
  res.json(banner);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return res.status(404).json({ error: "Banner not found" });
  res.json({ success: true });
});

export default router;
