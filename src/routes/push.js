const express = require('express');
const stmts = require('../../db');
const webpush = require('web-push');

const router = express.Router();

router.get('/public-key', (req, res) => {
  const vapidKeys = req.app.get('vapidKeys');
  if (!vapidKeys) return res.status(503).json({ error: 'Push not configured' });
  res.json({ publicKey: vapidKeys.publicKey });
});

router.post('/subscribe', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
    require('../../db').db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(JSON.stringify(subscription), req.session.userId);
    res.json({ ok: true });
  } catch (e) {
    console.error('Push subscribe error:', e);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

router.post('/unsubscribe', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    require('../../db').db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(null, req.session.userId);
    res.json({ ok: true });
  } catch (e) {
    console.error('Push unsubscribe error:', e);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router;
