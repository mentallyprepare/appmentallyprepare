const { SAFETY_KEYWORDS, CONTENT_FLAGS } = require('../config/constants');

function scanForSafety(text) {
  const lower = text.toLowerCase();
  const crisis = SAFETY_KEYWORDS.some(kw => lower.includes(kw));
  const pii = CONTENT_FLAGS.some(kw => lower.includes(kw));
  return { crisis, pii };
}

module.exports = { scanForSafety };
