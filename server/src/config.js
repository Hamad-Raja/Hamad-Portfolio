const bcryptHash = /^\$2[aby]\$(?:1[0-5])\$[./A-Za-z0-9]{53}$/;
export function authConfig(env = process.env) {
  const hash = env.ADMIN_PASSWORD_HASH || env.ADMIN_PASSWORD || "";
  if (!bcryptHash.test(hash)) throw new Error("Configure ADMIN_PASSWORD_HASH with bcrypt cost 10-15; see AUTH-MIGRATION.md");
  if (!env.ADMIN_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.ADMIN_EMAIL.trim())) throw new Error("Configure ADMIN_EMAIL");
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
  return { email: env.ADMIN_EMAIL.trim().toLowerCase(), hash, secret: env.JWT_SECRET };
}
export function allowedOrigins(env = process.env) {
  const values = (env.CLIENT_ORIGIN || (env.NODE_ENV === "production" ? "" : "http://localhost:5173")).split(',').map(v => v.trim()).filter(Boolean);
  if (!values.length || values.some(value => {
    try { const url = new URL(value); return !['http:', 'https:'].includes(url.protocol) || url.origin !== value || (env.NODE_ENV === "production" && url.protocol !== 'https:'); }
    catch { return true; }
  })) throw new Error("CLIENT_ORIGIN must list explicit origins separated by commas (HTTPS in production)");
  return values;
}
