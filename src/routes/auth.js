const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const limiter = require('express-rate-limit');
const stmts = require('../../db');

const router = express.Router();

const rateLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const resetTokens = new Map();

router.post('/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  try {
    const existing = stmts.getWaitlistEmail.get(email.toLowerCase().trim());
    if (existing) {
      return res.json({ status: 'ok', message: 'Already on the waitlist!', count: stmts.getWaitlistCount.get().count });
    }
    stmts.insertWaitlist.run(email.toLowerCase().trim(), new Date().toISOString());
    const count = stmts.getWaitlistCount.get().count;
    res.json({ status: 'ok', message: 'Joined the waitlist!', count });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.json({ status: 'ok', message: 'Already on the waitlist!', count: stmts.getWaitlistCount.get().count });
    }
    console.error('Waitlist error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, college, year, gender, match_pref_gender, match_pref_year, consentGiven } = req.body;
  if (!consentGiven) return res.status(400).json({ error: 'Consent must be given' });
  const id = crypto.randomUUID();
  const password_hash = await bcrypt.hash(password, 12);
  try {
    stmts.insertUser.run(id, name, email, password_hash, college, year, gender, 1, new Date().toISOString());
    req.session.userId = id;
    res.json({ status: 'ok', user: { id, name, email } });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = stmts.getUserByEmail.get(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.userId = user.id;
  res.json({ status: 'ok', user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/forgot-password', rateLimiter, (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = stmts.getUserByEmail.get(email.toLowerCase().trim());
    if (!user) return res.json({ ok: true, message: 'If that email exists, a reset code has been generated.' });
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, { userId: user.id, expires: Date.now() + 15 * 60 * 1000 });
    console.log(`  ✉ Password reset token for ${user.email}: ${token}`);
    res.json({ ok: true, message: 'If that email exists, a reset link has been generated.' });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/reset-password', rateLimiter, async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    const token = code;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const entry = resetTokens.get(token);
    if (!entry || entry.expires < Date.now()) {
      if (token) resetTokens.delete(token);
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    const user = stmts.getUserById.get(entry.userId);
    if (!user) return res.status(400).json({ error: 'User not found' });
    const hash = await bcrypt.hash(newPassword, 12);
    stmts.updateUserPassword.run(hash, user.id);
    resetTokens.delete(token);
    res.json({ ok: true });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;
