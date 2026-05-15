import { Router } from "express";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list projects
router.get("/", async (req, res) => {
  const featured = req.query.featured;
  const q = {};
  if (featured === "true") q.featured = true;

  const items = await Project.find(q).sort({ order: 1, createdAt: -1 }).lean();
  res.json(items);
});

// Public: single project
router.get("/:id", async (req, res) => {
  const item = await Project.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Admin: create
router.post("/", requireAuth, async (req, res) => {
  const payload = req.body || {};
  const item = await Project.create(payload);
  res.status(201).json(item);
});

// Admin: update
router.put("/:id", requireAuth, async (req, res) => {
  const payload = req.body || {};
  const item = await Project.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Admin: delete
router.delete("/:id", requireAuth, async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
