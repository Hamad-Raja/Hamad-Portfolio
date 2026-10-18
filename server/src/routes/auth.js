import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { authConfig } from "../config.js";
import { asyncRoute } from "../middleware/errors.js";
const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: "Too many login attempts. Please try again later." } });
router.post('/login', loginLimiter, asyncRoute(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || email.length > 120 || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) return res.status(401).json({ message: 'Invalid credentials' });
  const config = authConfig();
  const passwordOk = await bcrypt.compare(password, config.hash);
  if (email.trim().toLowerCase() !== config.email || !passwordOk) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ role: 'admin', email: config.email }, config.secret, { algorithm: 'HS256', expiresIn: '1h' });
  res.json({ token });
}));
export default router;
