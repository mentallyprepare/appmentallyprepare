const stmts = require('../../db');

const NOTIF_TYPES = {
  partner_entry: 'partner_entry',
  partner_comment: 'partner_comment',
  match_found: 'match_found',
  reveal: 'reveal',
  daily_prompt: 'daily_prompt',
  system: 'system'
};

function shouldNotify(userId, type) {
  try {
    const row = stmts.getUserNotifPrefs.get(userId);
    if (!row || !row.notif_prefs) return true;
    const prefs = JSON.parse(row.notif_prefs);
    return prefs[type] !== false;
  } catch {
    return true;
  }
}

function createNotification({ userId, type, title, body, data }) {
  if (!shouldNotify(userId, type)) return null;
  const dataStr = data ? JSON.stringify(data) : null;
  const result = stmts.insertNotification.run(userId, type, title, body, dataStr, new Date().toISOString());
  return result.lastInsertRowid;
}

function notifyPartnerEntry(partnerId, day, entryId) {
  return createNotification({
    userId: partnerId,
    type: NOTIF_TYPES.partner_entry,
    title: 'Your partner wrote',
    body: `Day ${day} — your partner just wrote their entry. You can read it now.`,
    data: { day, entryId }
  });
}

function notifyPartnerComment(partnerId, entryDay, commentText) {
  return createNotification({
    userId: partnerId,
    type: NOTIF_TYPES.partner_comment,
    title: 'New comment from your partner',
    body: `"${commentText.substring(0, 80)}${commentText.length > 80 ? '...' : ''}"`,
    data: { day: entryDay }
  });
}

function notifyMatchFound(userId, partnerName) {
  return createNotification({
    userId,
    type: NOTIF_TYPES.match_found,
    title: 'You\'ve been matched!',
    body: partnerName
      ? `You're now connected with ${partnerName}. Day 1 starts now.`
      : 'A connection has been found for you. Day 1 starts now.',
    data: {}
  });
}

function notifyRevealAvailable(userId) {
  return createNotification({
    userId,
    type: NOTIF_TYPES.reveal,
    title: 'Day 21 — Choose your reveal',
    body: 'The journey is complete. Do you want to reveal your identity to your partner?',
    data: {}
  });
}

function notifyDailyPrompt(userId, day) {
  return createNotification({
    userId,
    type: NOTIF_TYPES.daily_prompt,
    title: 'Your prompt is waiting',
    body: `Day ${day} of 21 — take 5 minutes to be honest.`,
    data: { day }
  });
}

module.exports = {
  NOTIF_TYPES, createNotification, shouldNotify,
  notifyPartnerEntry, notifyPartnerComment,
  notifyMatchFound, notifyRevealAvailable, notifyDailyPrompt
};
