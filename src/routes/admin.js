const express = require('express');
const stmts = require('../../db');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// All routes require admin
router.use(requireAdmin);

router.get('/stats', (req, res) => {
  try {
    const stats = stmts.getDashboardStats.get();
    res.json(stats);
  } catch {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

router.get('/users', (req, res) => {
  try {
    const rows = stmts.getAllUsersWithMatches.all();
    const users = [];
    const seen = new Set();
    for (const row of rows) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        users.push({
          id: row.id, name: row.name, email: row.email, college: row.college,
          year: row.year, gender: row.gender, archetype: row.archetype,
          role: row.role, consent_given: row.consent_given, created_at: row.created_at,
          match: row.match_id ? { id: row.match_id, started_at: row.match_started, active: row.match_active } : null
        });
      }
    }
    res.json({ users });
  } catch {
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.post('/users/:id/ban', (req, res) => {
  try {
    const user = stmts.getUserById.get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot ban an admin' });
    stmts.db.prepare('UPDATE users SET role = ? WHERE id = ?').run('banned', req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

router.post('/users/:id/unban', (req, res) => {
  try {
    const user = stmts.getUserById.get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    stmts.db.prepare('UPDATE users SET role = ? WHERE id = ?').run('user', req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

router.get('/matches', (req, res) => {
  try {
    const matches = stmts.getAllMatchesWithUsers.all();
    res.json({ matches });
  } catch {
    res.status(500).json({ error: 'Failed to load matches' });
  }
});

router.post('/matches/:id/reset', (req, res) => {
  try {
    stmts.deleteMatch.run(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to reset match' });
  }
});

router.get('/entries', (req, res) => {
  try {
    const flagged = stmts.getFlaggedEntries.all();
    const recent = stmts.db.prepare(`
      SELECT e.*, u.name as user_name, u.email as user_email
      FROM entries e
      JOIN users u ON e.user_id = u.id
      WHERE e.crisis_flag = 0 AND e.pii_flag = 0
      ORDER BY e.created_at DESC LIMIT 50
    `).all();
    res.json({ flagged, recent });
  } catch {
    res.status(500).json({ error: 'Failed to load entries' });
  }
});

router.get('/reports', (req, res) => {
  try {
    const reports = stmts.getAllReports.all();
    res.json({ reports });
  } catch {
    res.status(500).json({ error: 'Failed to load reports' });
  }
});

router.delete('/reports/:id', (req, res) => {
  try {
    stmts.deleteReport.run(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;
