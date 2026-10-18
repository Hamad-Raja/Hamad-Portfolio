import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
  res.set('Cache-Control', 'no-store');
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  try {
    if (!token || !process.env.JWT_SECRET) throw new Error('Unauthorized');
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (payload.role !== 'admin' || payload.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new Error('Unauthorized');
    req.user = payload;
    return next();
  } catch { return res.status(401).json({ message: 'Authentication required' }); }
}
