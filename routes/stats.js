import express from "express";
import Stat from "../models/Stat.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Stat.find().sort({ createdAt: 1 });
  res.json(items);
});

router.post("/", adminAuth, async (req, res) => {
  const item = await Stat.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", adminAuth, async (req, res) => {
  const item = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: "Stat not found" });
  res.json(item);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const item = await Stat.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Stat not found" });
  res.json({ success: true });
});

export default router;
