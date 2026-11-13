export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  const code = err.status || 500;
  if (code >= 500) console.error(err);
  return res.status(code).json({ message: code >= 500 ? 'Internal server error' : err.message });
}
