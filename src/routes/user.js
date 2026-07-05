const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const stmts = require('../../db');
const { getMatchDay, getPartnerId } = require('../utils/matching');
const { getAdaptivePrompt } = require('../utils/themes');
const { getMoodInsights } = require('../utils/mood');
const { prompts } = require('../config/constants');

const router = express.Router();

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ error: 'User removed' });
    }
    const safeUser = {
      name: user.name,
      email: user.email,
      college: user.college,
      year: user.year,
      archetype: user.archetype,
      scores: user.scores ? JSON.parse(user.scores) : null,
      gender: user.gender,
      matchPrefGender: user.match_pref_gender,
      matchPrefYear: user.match_pref_year
    };
    const match = stmts.getMatch.get(userId, userId);
    let matchData = null, entriesData = [], partnerEntries = [], streak = 0, revealData = null, comments = [];
    if (match) {
      const partnerId = getPartnerId(match, userId);
      const day = getMatchDay(match.started_at);
      const partner = stmts.getUserById.get(partnerId);
      matchData = {
        id: match.id, day,
        currentPrompt: prompts[(day - 1) % prompts.length],
        partner: partner ? { archetype: partner.archetype, scores: partner.scores ? JSON.parse(partner.scores) : null } : null,
        startedAt: match.started_at
      };
      entriesData = stmts.getUserEntries.all(userId);
      partnerEntries = stmts.getMatchEntries.all(match.id).filter(e => e.user_id !== userId && e.day_number < day);
      const allComments = stmts.getCommentsForEntry.all(match.id);
      comments = allComments.map(c => ({
        day: c.day, text: c.text,
        from: c.user_id === userId ? 'me' : 'partner',
        created_at: c.created_at
      }));
      const entryDays = new Set(entriesData.map(e => e.day));
      if (entryDays.has(day)) streak++;
      for (let d = day - 1; d >= 1; d--) {
        if (entryDays.has(d)) streak++; else break;
      }
      if (day >= 21) {
        const myReveal = stmts.getMatchReveals.all(match.id).find(r => r.user_id === userId);
        const partnerReveal = stmts.getMatchReveals.all(match.id).find(r => r.user_id === partnerId);
        const bothYes = myReveal && myReveal.choice === 'yes' && partnerReveal && partnerReveal.choice === 'yes';
        const eitherNo = (myReveal && myReveal.choice === 'no') || (partnerReveal && partnerReveal.choice === 'no');
        revealData = {
          available: true,
          myChoice: myReveal ? myReveal.choice : null,
          partnerChose: !!partnerReveal,
          revealed: bothYes,
          anonymous: eitherNo,
          partner: bothYes && partner ? { name: partner.name, college: partner.college, year: partner.year } : null
        };
      }
    }
    let adaptivePrompt = null;
    if (match && entriesData.length >= 2) {
      const day = getMatchDay(match.started_at);
      adaptivePrompt = getAdaptivePrompt(entriesData, day);
    }
    const insights = entriesData.length >= 3 ? getMoodInsights(entriesData) : null;
    res.json({ status: 'ok', user: safeUser, match: matchData, entries: entriesData, partnerEntries, streak, reveal: revealData, comments, adaptivePrompt, insights });
  } catch (err) {
    console.error('Error in /api/me:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/consent', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = stmts.getUserById.get(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ consentGiven: user.consent_given === 1, consentDate: user.created_at || null });
  } catch (e) {
    res.status(500).json({ error: 'Failed to check consent' });
  }
});

router.post('/consent/withdraw', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = stmts.getUserById.get(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    stmts.updateUser.run(user.name, user.email, user.college, user.year, user.gender, user.match_pref_gender, user.match_pref_year, 0, user.archetype, user.id);
    res.json({ ok: true, message: 'Consent withdrawn. You can still export or delete your data.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to withdraw consent' });
  }
});

router.get('/my-data', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = stmts.getMatch.get(userId, userId);
    const myEntries = stmts.getUserEntries.all(userId)
      .map(e => ({ day: e.day_number, prompt: e.prompt, text: e.text, mood: e.mood, written_at: e.created_at }));
    let myReveals = [];
    if (stmts.getMatchReveals && match) {
      myReveals = stmts.getMatchReveals.all(match.id).filter(r => r.user_id === userId)
        .map(r => ({ match_id: r.match_id, choice: r.choice, decided_at: r.created_at }));
    }
    const myComments = require('../../db').db.prepare('SELECT c.text, c.created_at, e.day_number as day FROM comments c JOIN entries e ON c.entry_id = e.id WHERE c.from_user_id = ?').all(userId)
      .map(c => ({ day: c.day, text: c.text, written_at: c.created_at }));
    const exportData = {
      exported_at: new Date().toISOString(),
      notice: 'This is all personal data Mentally Prepare holds about you. Partner details are excluded to protect their privacy.',
      profile: {
        name: user.name, email: user.email, college: user.college, year: user.year,
        gender: user.gender, matchGenderPref: user.match_pref_gender, matchYearPref: user.match_pref_year,
        archetype: user.archetype, scores: user.scores ? JSON.parse(user.scores) : null,
        consentGiven: !!user.consent_given,
        accountCreated: user.created_at
      },
      match: match ? { status: 'active', dayCount: getMatchDay(match.started_at) } : null,
      journal_entries: myEntries,
      comments: myComments,
      reveal_choices: myReveals
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="my-mentally-prepare-data.json"');
    res.json(exportData);
  } catch (e) {
    console.error('Data export error:', e);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

router.delete('/account', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password confirmation required to delete account' });
    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) return res.status(401).json({ error: 'Incorrect password. Account not deleted.' });
    const deleteAll = require('../../db').db.transaction(() => {
      stmts.insertDeletionLog.run(
        crypto.createHash('sha256').update(String(userId)).digest('hex').slice(0, 16),
        'user_requested',
        new Date().toISOString()
      );
      if (stmts.deleteUserEntries) stmts.deleteUserEntries.run(userId);
      if (stmts.deleteUserReveals) stmts.deleteUserReveals.run(userId);
      if (stmts.deleteUserComments) stmts.deleteUserComments.run(userId);
      if (stmts.deleteUserReports) stmts.deleteUserReports.run(userId);
      if (stmts.deleteUserMatches) stmts.deleteUserMatches.run(userId, userId);
      stmts.deleteUser.run(userId);
    });
    deleteAll();
    req.session.destroy(() => {
      res.json({ ok: true, message: 'Your account and all associated data has been permanently deleted.' });
    });
  } catch (e) {
    console.error('Account deletion error:', e);
    res.status(500).json({ error: 'Account deletion failed' });
  }
});

module.exports = router;
