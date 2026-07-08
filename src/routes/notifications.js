const express = require('express');
const stmts = require('../../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.get('/notifications', requireAuth, (req, res) => {
  try {
    const notifs = stmts.getUserNotifications.all(req.session.userId);
    const parsed = notifs.map(n => ({
      id: n.id, type: n.type, title: n.title, body: n.body,
      data: n.data ? JSON.parse(n.data) : null,
      read: !!n.read, createdAt: n.created_at
    }));
    const unread = stmts.getUnreadCount.get(req.session.userId).count;
    res.json({ notifications: parsed, unread });
  } catch (e) {
    console.error('Notifications error:', e);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

router.post('/notifications/read/:id', requireAuth, (req, res) => {
  try {
    stmts.markNotifRead.run(req.params.id, req.session.userId);
    const unread = stmts.getUnreadCount.get(req.session.userId).count;
    res.json({ ok: true, unread });
  } catch {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

router.post('/notifications/read-all', requireAuth, (req, res) => {
  try {
    stmts.markAllNotifRead.run(req.session.userId);
    res.json({ ok: true, unread: 0 });
  } catch {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

router.delete('/notifications/:id', requireAuth, (req, res) => {
  try {
    stmts.deleteNotif.run(req.params.id, req.session.userId);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

router.get('/notifications/preferences', requireAuth, (req, res) => {
  try {
    const row = stmts.getUserNotifPrefs.get(req.session.userId);
    const prefs = row?.notif_prefs ? JSON.parse(row.notif_prefs) : {};
    res.json({ preferences: prefs });
  } catch {
    res.status(500).json({ error: 'Failed to load preferences' });
  }
});

router.post('/notifications/preferences', requireAuth, (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Preferences object required' });
    }
    stmts.updateNotifPrefs.run(JSON.stringify(preferences), req.session.userId);
    res.json({ ok: true, preferences });
  } catch {
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

router.get('/notifications/unread', requireAuth, (req, res) => {
  try {
    const { count } = stmts.getUnreadCount.get(req.session.userId);
    res.json({ unread: count });
  } catch {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

module.exports = router;
