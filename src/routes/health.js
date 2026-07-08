const express = require('express');
const stmts = require('../../db');
const pkg = require('../../package.json');

const router = express.Router();
const startTime = Date.now();

router.get('/health', (req, res) => {
  try {
    stmts.db.prepare('SELECT 1').get();
    res.json({
      status: 'ok',
      version: pkg.version,
      uptime: Math.round((Date.now() - startTime) / 1000),
      db: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status: 'error',
      version: pkg.version,
      uptime: Math.round((Date.now() - startTime) / 1000),
      db: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
