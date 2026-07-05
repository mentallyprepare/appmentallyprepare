const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

function getProvider() {
  if (OPENAI_KEY) return 'openai';
  if (ANTHROPIC_KEY) return 'anthropic';
  return null;
}

async function callLLM(systemPrompt, userMessage) {
  const provider = getProvider();
  if (!provider) {
    return fallbackAnalysis(userMessage);
  }

  if (provider === 'openai') {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });
    if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
  }

  if (provider === 'anthropic') {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    if (!resp.ok) throw new Error(`Anthropic error: ${resp.status}`);
    const data = await resp.json();
    return data.content?.[0]?.text || '';
  }

  return '';
}

async function* streamLLM(systemPrompt, userMessage) {
  const provider = getProvider();
  if (!provider) {
    yield fallbackAnalysis(userMessage);
    return;
  }

  if (provider === 'openai') {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        stream: true
      })
    });
    if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) yield content;
        } catch { }
      }
    }
  }

  if (provider === 'anthropic') {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        stream: true
      })
    });
    if (!resp.ok) throw new Error(`Anthropic error: ${resp.status}`);
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            yield parsed.delta.text;
          }
        } catch { }
      }
    }
  }
}

function fallbackAnalysis(text) {
  const lower = text.toLowerCase();
  const themes = [];
  const themeKeywords = {
    isolation: ['alone','lonely','isolated','nobody','invisible','ignored','forgotten'],
    family: ['mom','dad','mother','father','parents','family','childhood','home'],
    self_worth: ['worthless','failure','imposter','not enough','inadequate','deserve'],
    fear: ['scared','afraid','anxious','panic','worry','terrified','nervous','dread'],
    hope: ['hope','better','dream','someday','future','wish','possible','light','grateful'],
    anger: ['angry','frustrated','rage','unfair','hate','furious','fed up','resentment'],
    grief: ['miss','lost','gone','grief','mourning','death','passed away','nostalgia'],
    connection: ['friend','close','trust','vulnerable','bond','deep','understand','listen','seen','heard'],
    pressure: ['pressure','expectations','perfect','grades','career','perform','compete','comparison','burnout']
  };
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    const matches = keywords.filter(kw => lower.includes(kw));
    if (matches.length > 0) themes.push({ theme, strength: matches.length });
  }
  themes.sort((a, b) => b.strength - a.strength);
  const archetypeMap = {
    isolation: 'disconnector', family: 'connector', self_worth: 'protector',
    fear: 'protector', hope: 'connector', anger: 'performer',
    grief: 'disconnector', connection: 'connector', pressure: 'performer'
  };
  const primaryTheme = themes[0]?.theme || 'connection';
  return JSON.stringify({
    themes: themes.slice(0, 3).map(t => t.theme),
    primaryTheme,
    suggestedArchetype: archetypeMap[primaryTheme] || 'connector',
    sentiment: themes.length > 0 ? 'reflective' : 'neutral',
    summary: 'Your writing suggests themes of ' + themes.map(t => t.theme.replace('_', ' ')).join(', ') + '.'
  });
}

const ANALYSIS_PROMPT = `You are an AI analyzing anonymous journal entries for an emotional wellness app. Analyze the content and return a JSON object with:
- themes: array of detected emotional themes (from: isolation, family, self_worth, fear, hope, anger, grief, connection, pressure)
- primaryTheme: the strongest theme
- suggestedArchetype: which of the 4 archetypes (protector, connector, performer, disconnector) best fits
- sentiment: overall tone (reflective, anxious, hopeful, sad, angry, peaceful)
- summary: one-sentence insight about the writer's emotional state

Return ONLY valid JSON, no markdown.`;

const ARCHETYPE_PROMPT = `You are an AI analyzing quiz responses for an emotional wellness app called Mentally Prepare. The user has answered questions about their emotional patterns. Based on their answers, generate a detailed archetype analysis.

Return a JSON object with these fields:
- archetype_name: a poetic 2-4 word name for their archetype
- core_truth: a profound one-sentence truth about them
- traits: object with 4 trait names (each 1-2 words) as keys and scores 0-100 as values
- strengths: array of 3 strengths
- growth_edges: array of 3 areas for growth
- match_affinity: what kind of partner would complement them
- reflection_prompt: a question to help them reflect deeper

Return ONLY valid JSON, no markdown.`;

async function analyzeJournal(content) {
  if (!content || !content.trim()) {
    return JSON.parse(fallbackAnalysis(''));
  }
  try {
    const result = await callLLM(ANALYSIS_PROMPT, `Journal entry:\n${content}`);
    const parsed = JSON.parse(result);
    return parsed;
  } catch {
    return JSON.parse(fallbackAnalysis(content));
  }
}

async function generateArchetypeAnalysis(answers) {
  const answersText = typeof answers === 'string'
    ? answers
    : JSON.stringify(answers, null, 2);
  try {
    const result = await callLLM(ARCHETYPE_PROMPT, `Quiz responses:\n${answersText}`);
    const parsed = JSON.parse(result);
    return parsed;
  } catch {
    return null;
  }
}

async function* streamArchetypeAnalysis(answers) {
  const answersText = typeof answers === 'string'
    ? answers
    : JSON.stringify(answers, null, 2);
  const stream = streamLLM(ARCHETYPE_PROMPT, `Quiz responses:\n${answersText}`);
  for await (const chunk of stream) {
    yield chunk;
  }
}

module.exports = {
  callLLM, streamLLM, analyzeJournal, generateArchetypeAnalysis, streamArchetypeAnalysis, getProvider
};
