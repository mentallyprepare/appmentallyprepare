const stmts = require('../../db');

function requireAdmin(req, res, next) {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = stmts.getUserById.get(userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.adminUser = user;
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { requireAdmin };
