// ── middleware/auth.js ────────────────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Inactive or not found' });
    req.user = user;
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid token' }); }
};

const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ success: false, message: 'Access denied' });

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class AppError extends Error {
  constructor(msg, code) { super(msg); this.statusCode = code; }
}

module.exports = { protect, authorize, asyncHandler, AppError };
