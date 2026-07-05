const { EMOTIONAL_THEMES } = require('../config/constants');

function detectThemes(entries) {
  const themeCounts = {};
  const recentEntries = entries.slice(0, 3);
  const combinedText = recentEntries.map(e => e.text).join(' ').toLowerCase();

  for (const [theme, config] of Object.entries(EMOTIONAL_THEMES)) {
    const count = config.keywords.reduce((sum, kw) => {
      const regex = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      const matches = combinedText.match(regex);
      return sum + (matches ? matches.length : 0);
    }, 0);
    if (count > 0) themeCounts[theme] = count;
  }

  return Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme);
}

function getAdaptivePrompt(entries, day) {
  if (entries.length < 2) return null;
  const themes = detectThemes(entries);
  if (themes.length === 0) return null;
  const topTheme = themes[0];
  const themeConfig = EMOTIONAL_THEMES[topTheme];
  const promptIdx = (day + topTheme.length) % themeConfig.prompts.length;
  return { prompt: themeConfig.prompts[promptIdx], theme: topTheme, label: topTheme.replace('_', ' ') };
}

module.exports = { detectThemes, getAdaptivePrompt };
