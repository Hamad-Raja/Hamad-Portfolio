import { Router } from "express";
import rateLimit from "express-rate-limit";
import Message from "../models/Message.js";
import { contactPayload } from "../validation.js";
import { asyncRoute } from "../middleware/errors.js";
const router = Router();
const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many messages. Please try again later.' } });
router.post('/', contactLimiter, asyncRoute(async (req, res) => {
  if (req.body?.website) return res.status(201).json({ ok: true });
  const payload = contactPayload(req.body);
  await Message.create({ ...payload, ip: req.ip || '' });
  res.status(201).json({ ok: true });
}));
export default router;
