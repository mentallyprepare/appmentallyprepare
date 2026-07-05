const app = require('./src/app');
const { scanForSafety } = require('./src/utils/safety');
const { detectThemes, getAdaptivePrompt } = require('./src/utils/themes');
const { getMoodInsights } = require('./src/utils/mood');
const { attemptMatch, getMatchDay, getPartnerId } = require('./src/utils/matching');
const { prompts, HELPLINES, EMOTIONAL_THEMES, SAFETY_KEYWORDS, CONTENT_FLAGS, PORT } = require('./src/config/constants');

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\nMentally Prepare app running on http://localhost:${PORT}`);
  });
}

module.exports = { app, scanForSafety, detectThemes, getAdaptivePrompt, getMoodInsights, attemptMatch, getMatchDay, getPartnerId, prompts, HELPLINES, EMOTIONAL_THEMES, SAFETY_KEYWORDS, CONTENT_FLAGS };
