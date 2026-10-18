function fail(message) { const error = new Error(message); error.status = 400; throw error; }
function object(value) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail("A JSON object is required"); return value; }
function text(value, key, min, max, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== 'string') fail(`${key} must be text`);
  const clean = value.trim();
  if (clean.length < min || clean.length > max) fail(`${key} must contain ${min}-${max} characters`);
  return clean;
}
function url(value, key, asset = false) {
  const clean = text(value, key, 0, 2048, '');
  if (!clean) return '';
  if (asset && /^\/(?!\/)[^\\\s?#]*$/.test(clean)) return clean;
  try { const parsed = new URL(clean); if (/^https?:\/\//i.test(clean) && ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password) return parsed.href; } catch { /* validation below */ }
  fail(`${key} must be an HTTP or HTTPS URL${asset ? ' or a local asset path' : ''}`);
}
export function contactPayload(body) {
  const input = object(body);
  const name = text(input.name, 'Name', 2, 80);
  const email = text(input.email, 'Email', 3, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Enter a valid email address");
  return { name, email, subject: text(input.subject, 'Subject', 0, 120, ''), message: text(input.message, 'Message', 10, 2000) };
}
export function projectPayload(body) {
  const input = object(body);
  const allowed = ['title','description','tech','imageUrl','liveUrl','githubUrl','featured','order'];
  if (Object.keys(input).some(key => !allowed.includes(key))) fail("Unknown project field");
  const payload = { title: text(input.title,'Title',1,120), description: text(input.description,'Description',1,800) };
  if (input.tech !== undefined && (!Array.isArray(input.tech) || input.tech.length > 30)) fail("Tech must contain up to 30 labels");
  payload.tech = [...new Set((input.tech || []).map(v => text(v,'Technology',1,50)))];
  for (const key of ['imageUrl','liveUrl','githubUrl']) payload[key] = url(input[key],key,key === 'imageUrl');
  if (input.featured !== undefined && typeof input.featured !== 'boolean') fail("Featured must be true or false");
  if (input.order !== undefined && (!Number.isSafeInteger(input.order) || Math.abs(input.order) > 100000)) fail("Order must be an integer between -100000 and 100000");
  payload.featured = input.featured ?? false;
  payload.order = input.order ?? 0;
  return payload;
}
export function validId(req, res, next) {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "Invalid record ID" });
  next();
}
