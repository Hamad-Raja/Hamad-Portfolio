import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: origin === "*" ? "*" : [origin],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const port = process.env.PORT || 5000;

async function start() {
  const mongo = process.env.MONGO_URI;
  if (!mongo) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(mongo);
  console.log("✅ MongoDB connected");
  app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
