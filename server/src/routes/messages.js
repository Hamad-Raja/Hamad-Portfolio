import { Router } from "express";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Admin: list messages
router.get("/", requireAuth, async (req, res) => {
  const items = await Message.find({}).sort({ createdAt: -1 }).limit(200).lean();
  res.json(items);
});

// Admin: delete message
router.delete("/:id", requireAuth, async (req, res) => {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
