import express from "express";
import Batch from "../models/Batch.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const batches = await Batch.find().sort({ createdAt: 1 });
  res.json(batches);
});

router.post("/", adminAuth, async (req, res) => {
  const batch = await Batch.create(req.body);
  res.status(201).json(batch);
});

router.put("/:id", adminAuth, async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!batch) return res.status(404).json({ error: "Slot not found" });
  res.json(batch);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const batch = await Batch.findByIdAndDelete(req.params.id);
  if (!batch) return res.status(404).json({ error: "Slot not found" });
  res.json({ success: true });
});

export default router;
