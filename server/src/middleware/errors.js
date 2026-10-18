export const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === "entity.too.large") return res.status(413).json({ message: "Request is too large" });
  if (error.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body" });
  if (error.name === "ValidationError" || error.name === "CastError") return res.status(400).json({ message: "Please check the supplied values" });
  if (error.status === 400) return res.status(400).json({ message: error.message });
  // Never log request bodies, credentials, connection strings, or raw database errors.
  console.error("Request failed", { method: req.method, type: error.name || "Error" });
  return res.status(500).json({ message: "The service is temporarily unavailable. Please try again." });
}
