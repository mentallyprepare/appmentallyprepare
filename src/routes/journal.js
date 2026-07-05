const express = require('express');
const crypto = require('crypto');
const stmts = require('../../db');
const { scanForSafety } = require('../utils/safety');
const { HELPLINES, prompts } = require('../config/constants');
const { getMatchDay } = require('../utils/matching');
const { analyzeJournal, getProvider } = require('../services/llm');
const { notifyPartnerEntry, notifyPartnerComment } = require('../services/notifications');

const router = express.Router();

router.post('/entry', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { text, mood } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Entry text required' });
    if (text.length > 5000) return res.status(400).json({ error: 'Entry too long (max 5000 chars)' });
    const safety = scanForSafety(text);
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });
    const day = getMatchDay(match.started_at);
    if (day > 21) return res.status(400).json({ error: 'Journey complete' });
    const prompt = prompts[(day - 1) % prompts.length];
    stmts.upsertEntry.run(userId, match.id, day, prompt, text.trim(), mood || '🌓', safety.crisis ? 1 : 0, safety.pii ? 1 : 0, new Date().toISOString());

    const partnerId = require('../utils/matching').getPartnerId(match, userId);
    const entryResult = stmts.getEntry.get(userId, match.id, day);
    notifyPartnerEntry(partnerId, day, entryResult?.id);

    let aiAnalysis = null;
    if (getProvider()) {
      try {
        aiAnalysis = await analyzeJournal(text);
      } catch { }
    }

    res.json({ ok: true, day, safety: { crisis: safety.crisis, pii: safety.pii, helplines: safety.crisis ? HELPLINES : null }, aiAnalysis });
  } catch (e) {
    console.error('Entry error:', e);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

router.post('/comment', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { day, text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });
    if (text.length > 500) return res.status(400).json({ error: 'Comment too long (max 500 chars)' });
    if (!day || day < 1 || day > 21) return res.status(400).json({ error: 'Invalid day' });
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });
    const currentDay = getMatchDay(match.started_at);
    if (day >= currentDay) return res.status(400).json({ error: 'That entry is still sealed' });
    const partnerId = require('../utils/matching').getPartnerId(match, userId);
    const partnerEntry = stmts.getEntry.get(partnerId, match.id, day);
    if (!partnerEntry) return res.status(400).json({ error: 'No partner entry to comment on' });
    stmts.insertComment.run(crypto.randomUUID(), partnerEntry.id, userId, text.trim(), new Date().toISOString());
    notifyPartnerComment(partnerId, day, text.trim());
    res.json({ ok: true });
  } catch (e) {
    console.error('Comment error:', e);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

router.post('/reveal', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { choice } = req.body;
    if (choice !== 'yes' && choice !== 'no') return res.status(400).json({ error: 'Choice must be yes or no' });
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });
    const day = getMatchDay(match.started_at);
    if (day < 21) return res.status(400).json({ error: 'Not yet Day 21' });
    stmts.upsertReveal.run(match.id, userId, choice, new Date().toISOString());
    res.json({ ok: true });
  } catch (e) {
    console.error('Reveal error:', e);
    res.status(500).json({ error: 'Failed to save reveal choice' });
  }
});

router.post('/report', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { day, reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ error: 'Reason required' });
    stmts.insertReport.run(userId, day || 0, reason.trim().substring(0, 500), new Date().toISOString());
    res.json({ ok: true });
  } catch (e) {
    console.error('Report error:', e);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

module.exports = router;
