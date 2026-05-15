import { Router } from "express";
import rateLimit from "express-rate-limit";
import Message from "../models/Message.js";

const router = Router();

// Stricter limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "name, email, message are required" });
  }
  const doc = await Message.create({
    name,
    email,
    subject: subject || "",
    message,
    ip: req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "",
  });

  res.status(201).json({ ok: true, id: doc._id });
});

export default router;
