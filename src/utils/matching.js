const stmts = require('../../db');
const { complementary } = require('../config/constants');

function attemptMatch(userId) {
  const user = stmts.getUserById.get(userId);
  if (!user || !user.archetype) return null;
  const targetType = complementary[user.archetype];
  if (!targetType) return null;

  let candidates = stmts.getUsersForMatching.all().filter(c =>
    c.archetype === targetType &&
    c.college.toLowerCase() !== user.college.toLowerCase() &&
    c.id !== userId
  );

  // Exclude ones already matched
  candidates = candidates.filter(c => !stmts.getMatch.get(c.id, c.id));

  // Gender preference filtering
  if (user.match_pref_gender && user.match_pref_gender !== 'any') {
    const filtered = candidates.filter(c => c.gender === user.match_pref_gender);
    if (filtered.length > 0) candidates = filtered;
  }
  candidates = candidates.filter(c => {
    if (!c.match_pref_gender || c.match_pref_gender === 'any') return true;
    return c.match_pref_gender === user.gender;
  });

  // Year preference filtering (soft)
  if (user.match_pref_year && user.match_pref_year !== 'any') {
    const yearNums = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '5th+': 5 };
    let yearFiltered;
    if (user.match_pref_year === '±1_year' || user.match_pref_year === 'nearby') {
      const userYearNum = yearNums[user.year] || 3;
      yearFiltered = candidates.filter(c => Math.abs((yearNums[c.year] || 3) - userYearNum) <= 1);
    } else {
      yearFiltered = candidates.filter(c => c.year === user.match_pref_year);
    }
    if (yearFiltered.length > 0) candidates = yearFiltered;
  }

  const partner = candidates[0] || null;
  if (partner) {
    const crypto = require('crypto');
    stmts.insertMatch.run(crypto.randomUUID(), userId, partner.id, new Date().toISOString());
    return true;
  }
  return null;
}

function getMatchDay(startedAt) {
  const started = new Date(startedAt);
  const now = new Date();
  const startDay = Date.UTC(started.getUTCFullYear(), started.getUTCMonth(), started.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.min(Math.max(Math.floor((today - startDay) / 86400000) + 1, 1), 21);
}

function getPartnerId(match, userId) {
  return match.user1_id === userId ? match.user2_id : match.user1_id;
}

module.exports = { attemptMatch, getMatchDay, getPartnerId };
