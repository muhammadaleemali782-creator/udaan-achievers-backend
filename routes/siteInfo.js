import express from "express";
import SiteInfo from "../models/SiteInfo.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Public: get contact info (auto-creates default on first call)
router.get("/", async (req, res) => {
  let info = await SiteInfo.findOne({ key: "contact" });
  if (!info) info = await SiteInfo.create({ key: "contact" });
  res.json(info);
});

// Admin: update contact info
router.put("/", adminAuth, async (req, res) => {
  const info = await SiteInfo.findOneAndUpdate(
    { key: "contact" },
    { ...req.body, key: "contact" },
    { new: true, upsert: true }
  );
  res.json(info);
});

export default router;
