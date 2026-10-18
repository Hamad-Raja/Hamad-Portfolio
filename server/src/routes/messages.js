import { Router } from "express";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncRoute } from "../middleware/errors.js";
import { validId } from "../validation.js";
const router = Router();
router.use(requireAuth);
router.get('/', asyncRoute(async (req, res) => {
  res.json(await Message.find({}).sort({ createdAt: -1 }).limit(200).lean());
}));
router.delete('/:id', validId, asyncRoute(async (req, res) => {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}));
export default router;
