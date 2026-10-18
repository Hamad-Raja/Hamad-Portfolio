import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

/**
 * Admin login
 * Body: { email, password }
 * Uses ADMIN_EMAIL + ADMIN_PASSWORD from env.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server auth is not configured" });
  }

  const emailOk = String(email || "").toLowerCase() === String(adminEmail).toLowerCase();
  const passwordOk = await (async () => {
    // If ADMIN_PASSWORD looks like a bcrypt hash, compare it.
    if (String(adminPassword).startsWith("$2")) {
      return bcrypt.compare(String(password || ""), adminPassword);
    }
    return String(password || "") === String(adminPassword);
  })();

  if (!emailOk || !passwordOk) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email: adminEmail },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

export default router;
