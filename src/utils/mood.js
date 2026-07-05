function getMoodInsights(entries) {
  if (entries.length < 3) return null;
  const moodMap = { '🌑': 1, '🌒': 2, '🌓': 3, '🌔': 4, '🌕': 5 };
  const moodLabels = { '🌑': 'Heavy', '🌒': 'Quiet', '🌓': 'Okay', '🌔': 'Lighter', '🌕': 'Good' };

  const moodTrend = entries.slice().sort((a, b) => a.day_number - b.day_number)
    .map(e => ({ day: e.day_number, mood: e.mood, value: moodMap[e.mood] || 3 }));

  const counts = {};
  entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
  const dominantMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  const recent = moodTrend.slice(-3);
  const earlier = moodTrend.slice(0, 3);
  const recentAvg = recent.reduce((s, m) => s + m.value, 0) / recent.length;
  const earlierAvg = earlier.reduce((s, m) => s + m.value, 0) / earlier.length;
  const trend = recentAvg > earlierAvg + 0.3 ? 'rising' : recentAvg < earlierAvg - 0.3 ? 'dipping' : 'steady';

  const totalWords = entries.reduce((sum, e) => sum + (e.text ? e.text.trim().split(/\s+/).length : 0), 0);

  return {
    moodTrend, dominantMood,
    dominantLabel: moodLabels[dominantMood] || 'Okay',
    trend, totalWords,
    avgWords: Math.round(totalWords / entries.length),
    uniqueMoods: Object.keys(counts).length
  };
}

module.exports = { getMoodInsights };
