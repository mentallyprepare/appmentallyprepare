const express = require('express');
const { generateArchetypeAnalysis, streamArchetypeAnalysis } = require('../services/llm');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: 'Answers are required' });
    const analysis = await generateArchetypeAnalysis(answers);
    if (!analysis) return res.status(503).json({ error: 'LLM not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.' });
    res.json(analysis);
  } catch (e) {
    console.error('Analyze error:', e);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

router.post('/analyze/stream', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: 'Answers are required' });

    const provider = require('../services/llm').getProvider();
    if (!provider) return res.status(503).json({ error: 'LLM not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = streamArchetypeAnalysis(answers);
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e) {
    console.error('Analyze stream error:', e);
    if (!res.headersSent) res.status(500).json({ error: 'Analysis failed' });
    res.end();
  }
});

module.exports = router;
