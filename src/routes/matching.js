const express = require('express');
const stmts = require('../../db');
const { attemptMatch, getMatchDay, getPartnerId } = require('../utils/matching');
const { getAdaptivePrompt } = require('../utils/themes');
const { getMoodInsights } = require('../utils/mood');
const { prompts, EMOTIONAL_THEMES } = require('../config/constants');

const router = express.Router();

router.post('/scan', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { scores, archetype } = req.body;
    if (!archetype || !scores) return res.status(400).json({ error: 'Scan data required' });
    const validTypes = ['protector', 'connector', 'performer', 'disconnector'];
    if (!validTypes.includes(archetype)) return res.status(400).json({ error: 'Invalid archetype' });
    const userId = req.session.userId;
    const existingMatch = stmts.getMatch.get(userId, userId);
    if (existingMatch) return res.status(400).json({ error: 'Cannot retake scan after matching' });
    const user = stmts.getUserById.get(userId);
    stmts.updateUser.run(user.name, user.email, user.college, user.year, user.gender, user.match_pref_gender, user.match_pref_year, user.consent_given, archetype, userId);
    const matched = attemptMatch(userId);
    res.json({ ok: true, matched: !!matched });
  } catch (e) {
    console.error('Scan error:', e);
    res.status(500).json({ error: 'Failed to save scan' });
  }
});

router.get('/partner-status', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.json({ hasPartner: false });
    const partnerId = getPartnerId(match, userId);
    const partnerCount = stmts.getUserEntries.all(partnerId).length;
    const daysSinceActive = 0;
    res.json({
      hasPartner: true, daysSinceActive, partnerEntryCount: partnerCount,
      canSwitch: daysSinceActive >= 5,
      status: 'active'
    });
  } catch (e) {
    console.error('Partner status error:', e);
    res.status(500).json({ error: 'Failed to check partner status' });
  }
});

router.post('/switch-partner', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No current match to switch from' });
    stmts.deleteMatch.run(match.id);
    const newMatch = attemptMatch(userId);
    res.json({ ok: true, matched: !!newMatch, switchesRemaining: 1 });
  } catch (e) {
    console.error('Switch error:', e);
    res.status(500).json({ error: 'Failed to switch partner' });
  }
});

module.exports = router;
