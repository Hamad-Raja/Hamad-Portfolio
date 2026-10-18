import { Router } from "express";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncRoute } from "../middleware/errors.js";
import { projectPayload, validId } from "../validation.js";
const router = Router();
router.get('/', asyncRoute(async (req, res) => {
  const q = req.query.featured === 'true' ? { featured: true } : {};
  res.json(await Project.find(q).sort({ order: 1, createdAt: -1 }).lean());
}));
router.get('/:id', validId, asyncRoute(async (req, res) => {
  const item = await Project.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));
router.post('/', requireAuth, asyncRoute(async (req, res) => {
  res.status(201).json(await Project.create(projectPayload(req.body)));
}));
router.put('/:id', requireAuth, validId, asyncRoute(async (req, res) => {
  const item = await Project.findByIdAndUpdate(req.params.id, { $set: projectPayload(req.body) }, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));
router.delete('/:id', requireAuth, validId, asyncRoute(async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}));
export default router;
