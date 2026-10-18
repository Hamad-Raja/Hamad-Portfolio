import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import { allowedOrigins, authConfig } from "./config.js";
import { errorHandler } from "./middleware/errors.js";
export function createApp(env = process.env) {
  authConfig(env);
  const origins = allowedOrigins(env);
  const app = express();
  app.disable('x-powered-by');
  // Set only to a known, fixed proxy hop count. Never trust arbitrary forwarded IPs.
  if (env.TRUST_PROXY_HOPS) {
    if (!/^[1-9]\d?$/.test(env.TRUST_PROXY_HOPS)) throw new Error('Invalid TRUST_PROXY_HOPS');
    app.set('trust proxy', Number(env.TRUST_PROXY_HOPS));
  }
  app.use(helmet());
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.includes(origin)), credentials: false }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many requests. Please try again later.' } }));
  app.use(express.json({ limit: '32kb' }));
  if (env.NODE_ENV !== 'test') app.use(morgan(':method :status :response-time ms'));
  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/messages', messageRoutes);
  app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
  app.use(errorHandler);
  return app;
}
