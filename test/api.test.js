const { expect } = require('chai');
const request = require('supertest');
const path = require('path');
const fs = require('fs');

describe('API Endpoints', function () {
  let app;
  let agent;

  before(function () {
    // Setup test DB
    const TEST_DB_PATH = path.join(__dirname, 'test-mentally-prepare.db');
    process.env.DB_PATH = TEST_DB_PATH;
    process.env.NODE_ENV = 'test';

    // Clean any previous test DB
    try { fs.unlinkSync(TEST_DB_PATH); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-wal'); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-shm'); } catch { }

    // Clear caches and load fresh
    delete require.cache[require.resolve('../db')];
    delete require.cache[require.resolve('../server')];

    app = require('../server');
    if (app.app) app = app.app;
    agent = request.agent(app);
  });

  after(function () {
    const TEST_DB_PATH = path.join(__dirname, 'test-mentally-prepare.db');
    try { fs.unlinkSync(TEST_DB_PATH); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-wal'); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-shm'); } catch { }
  });

  // ─── Waitlist ─────────────────────────────────────
  describe('POST /api/waitlist', () => {
    it('adds an email to the waitlist', async () => {
      const res = await agent.post('/api/waitlist').send({ email: 'test@example.com' });
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
    });

    it('rejects invalid email', async () => {
      const res = await agent.post('/api/waitlist').send({ email: 'notanemail' });
      expect(res.status).to.equal(400);
    });

    it('deduplicates emails', async () => {
      await agent.post('/api/waitlist').send({ email: 'dupe@example.com' });
      const res = await agent.post('/api/waitlist').send({ email: 'dupe@example.com' });
      expect(res.body.message).to.match(/already/i);
    });
  });

  // ─── Auth ─────────────────────────────────────────
  describe('POST /api/register', () => {
    const newUser = {
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      college: 'Test University',
      year: '2nd',
      gender: 'male',
      consentGiven: true
    };

    it('registers a new user', async () => {
      const res = await agent.post('/api/register').send(newUser);
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
      expect(res.body.user).to.have.property('id');
    });

    it('rejects duplicate email', async () => {
      const res = await agent.post('/api/register').send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.error).to.match(/exists/i);
    });

    it('rejects without consent', async () => {
      const res = await agent.post('/api/register').send({
        ...newUser, email: 'noconsent@test.com', consentGiven: false
      });
      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/login', () => {
    it('logs in with valid credentials', async () => {
      // Register fresh user for login test
      const email = 'login@test.com';
      await agent.post('/api/register').send({
        name: 'Login Test', email, password: 'password123',
        college: 'U', year: '1st', gender: 'female', consentGiven: true
      });
      const res = await agent.post('/api/login').send({ email, password: 'password123' });
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
    });

    it('rejects invalid credentials', async () => {
      const res = await agent.post('/api/login').send({ email: 'login@test.com', password: 'wrongpassword' });
      expect(res.status).to.equal(401);
    });
  });

  // ─── Authenticated Endpoints ──────────────────────
  describe('GET /api/me', () => {
    it('returns user data when authenticated', async () => {
      const res = await agent.get('/api/me');
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
      expect(res.body.user).to.have.property('name');
    });

    it('rejects when not authenticated', async () => {
      const anon = request.agent(app);
      const res = await anon.get('/api/me');
      expect(res.status).to.equal(401);
    });
  });

  // ─── Scan & Match ─────────────────────────────────
  describe('POST /api/scan', () => {
    it('rejects invalid archetype', async () => {
      const res = await agent.post('/api/scan').send({ scores: {}, archetype: 'invalid' });
      expect(res.status).to.equal(400);
    });

    it('saves archetype and attempts match', async () => {
      const res = await agent.post('/api/scan').send({ scores: { openness:42, awareness:58, guard:71, reciprocity:35 }, archetype: 'protector' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('matched');
    });

    it('persists scores to DB and /api/me', async () => {
      const me = await agent.get('/api/me');
      expect(me.body.user.archetype).to.equal('protector');
      expect(me.body.user.scores).to.deep.equal({ openness:42, awareness:58, guard:71, reciprocity:35 });
    });
  });

  // ─── Password Reset ────────────────────────────
  describe('POST /api/forgot-password', () => {
    it('rejects missing email', async () => {
      const res = await agent.post('/api/forgot-password').send({});
      expect(res.status).to.equal(400);
    });

    it('returns ok even for unknown email', async () => {
      const res = await agent.post('/api/forgot-password').send({ email: 'ghost@test.com' });
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.be.true;
    });

    it('returns ok for known email', async () => {
      const res = await agent.post('/api/forgot-password').send({ email: 'login@test.com' });
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.be.true;
    });
  });

  describe('POST /api/reset-password', () => {
    it('rejects missing fields', async () => {
      const res = await agent.post('/api/reset-password').send({});
      expect(res.status).to.equal(400);
    });

    it('rejects short password', async () => {
      const res = await agent.post('/api/reset-password').send({ code: 'x', newPassword: '1234567' });
      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('at least 8');
    });

    it('rejects invalid token', async () => {
      const res = await agent.post('/api/reset-password').send({ code: 'badtoken', newPassword: 'newpass1234' });
      expect(res.status).to.equal(400);
      expect(res.body.error).to.include('expired');
    });

    it('completes full reset flow', async () => {
      // Request reset — token is stored in the exported resetTokens map
      const authModule = require('../src/routes/auth');
      const prevCount = authModule.resetTokens.size;
      await agent.post('/api/forgot-password').send({ email: 'login@test.com' });
      expect(authModule.resetTokens.size).to.equal(prevCount + 1);

      // Grab the generated token
      const entries = [...authModule.resetTokens.entries()];
      const [token, entry] = entries[entries.length - 1];
      expect(entry.expires).to.be.greaterThan(Date.now());

      // Reset with the real token
      const res = await agent.post('/api/reset-password').send({ code: token, newPassword: 'newpass1234' });
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.be.true;

      // Token should be consumed
      expect(authModule.resetTokens.has(token)).to.be.false;

      // Login with new password
      const login = await agent.post('/api/login').send({ email: 'login@test.com', password: 'newpass1234' });
      expect(login.status).to.equal(200);
    });
  });

  // ─── Journal Entry ────────────────────────────────
  describe('POST /api/entry', () => {
    it('rejects without text', async () => {
      const res = await agent.post('/api/entry').send({ mood: '🌓' });
      expect(res.status).to.equal(400);
    });

    it('rejects if over 5000 chars', async () => {
      const res = await agent.post('/api/entry').send({ text: 'x'.repeat(5001), mood: '🌓' });
      expect(res.status).to.equal(400);
    });
  });

  // ─── Consent ──────────────────────────────────────
  describe('GET /api/consent', () => {
    it('returns consent status', async () => {
      const res = await agent.get('/api/consent');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('consentGiven');
    });
  });

  // ─── Push Public Key ──────────────────────────────
  describe('GET /api/push/public-key', () => {
    it('returns public key or 503 if not configured', async () => {
      const res = await agent.get('/api/push/public-key');
      // Without VAPID keys configured it may fail or succeed
      expect([200, 503]).to.include(res.status);
    });
  });

  // ─── Payment History ──────────────────────────────
  describe('GET /api/pay/history', () => {
    it('returns payment history', async () => {
      const res = await agent.get('/api/pay/history');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('payments');
    });
  });

  // ─── Analyze ───────────────────────────────────
  describe('POST /api/analyze', () => {
    it('rejects missing answers', async () => {
      const res = await agent.post('/api/analyze').send({});
      expect(res.status).to.equal(400);
    });

    it('returns fallback analysis without API key', async () => {
      const res = await agent.post('/api/analyze').send({ answers: { q1: 'I feel so alone lately' } });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('themes');
      expect(res.body).to.have.property('primaryTheme');
      expect(res.body).to.have.property('suggestedArchetype');
    });
  });

  describe('POST /api/analyze/stream', () => {
    it('rejects missing answers', async () => {
      const res = await agent.post('/api/analyze/stream').send({});
      expect(res.status).to.equal(400);
    });

    it('returns SSE stream with fallback', async () => {
      const res = await agent.post('/api/analyze/stream').send({ answers: { q1: 'I feel alone' } });
      expect(res.status).to.equal(200);
      expect(res.headers['content-type']).to.include('text/event-stream');
      expect(res.text).to.include('[DONE]');
    });
  });

  // ─── Health ────────────────────────────────────
  describe('GET /api/health', () => {
    it('returns server status', async () => {
      const res = await agent.get('/api/health');
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('ok');
      expect(res.body).to.have.property('version');
      expect(res.body).to.have.property('uptime');
      expect(res.body.db).to.equal('connected');
    });
  });

  // ─── Notifications ─────────────────────────────
  describe('GET /api/notifications', () => {
    before(async function () {
      // Insert a test notification for the logged-in user
      const stmts = require('../db');
      const me = await agent.get('/api/me');
      if (me.body.user?.email) {
        const user = stmts.getUserByEmail.get(me.body.user.email);
        stmts.insertNotification.run(user.id, 'system', 'Test title', 'Test body', null, new Date().toISOString());
        stmts.insertNotification.run(user.id, 'match_found', 'Match!', 'You matched', null, new Date().toISOString());
      }
    });

    it('returns notifications list', async () => {
      const res = await agent.get('/api/notifications');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('notifications');
      expect(res.body.notifications.length).to.be.at.least(2);
      expect(res.body).to.have.property('unread');
    });
  });

  describe('POST /api/notifications/read/:id', () => {
    it('marks a notification as read', async () => {
      const list = await agent.get('/api/notifications');
      const notif = list.body.notifications[0];
      const res = await agent.post(`/api/notifications/read/${notif.id}`);
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.be.true;
    });
  });

  describe('POST /api/notifications/read-all', () => {
    it('marks all as read', async () => {
      const res = await agent.post('/api/notifications/read-all');
      expect(res.status).to.equal(200);
      expect(res.body.unread).to.equal(0);
    });
  });

  describe('GET /api/notifications/unread', () => {
    it('returns unread count', async () => {
      const res = await agent.get('/api/notifications/unread');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('unread');
    });
  });

  describe('GET /api/notifications/preferences', () => {
    it('returns preferences', async () => {
      const res = await agent.get('/api/notifications/preferences');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('preferences');
    });
  });

  describe('POST /api/notifications/preferences', () => {
    it('updates preferences', async () => {
      const prefs = { partner_entry: false, match_found: true };
      const res = await agent.post('/api/notifications/preferences').send({ preferences: prefs });
      expect(res.status).to.equal(200);
      expect(res.body.preferences).to.deep.equal(prefs);
    });

    it('rejects invalid preferences', async () => {
      const res = await agent.post('/api/notifications/preferences').send({ preferences: 'not-an-object' });
      expect(res.status).to.equal(400);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('deletes a notification', async () => {
      const list = await agent.get('/api/notifications');
      const notif = list.body.notifications[0];
      const res = await agent.delete(`/api/notifications/${notif.id}`);
      expect(res.status).to.equal(200);
      expect(res.body.ok).to.be.true;
    });
  });

  // ─── 401 on protected endpoints ───────────────────
  describe('Unauthenticated access', () => {
    let anon;
    before(() => {
      anon = request.agent(app);
    });

    const protectedEndpoints = [
      ['post', '/api/scan', {}],
      ['post', '/api/entry', { text: 'test' }],
      ['post', '/api/comment', { day: 1, text: 'hi' }],
      ['post', '/api/reveal', { choice: 'yes' }],
      ['post', '/api/report', { reason: 'test' }],
      ['post', '/api/consent/withdraw', {}],
      ['post', '/api/push/subscribe', { subscription: { endpoint: 'http://x' } }],
      ['post', '/api/push/unsubscribe', {}],
      ['post', '/api/pay/razorpay/create', { product: 'archetype-pdf' }],
      ['post', '/api/pay/stripe/create', { product: 'archetype-pdf' }],
      ['get', '/api/pay/history'],
      ['get', '/api/my-data'],
      ['delete', '/api/account'],
      ['get', '/api/notifications'],
      ['get', '/api/notifications/unread'],
      ['get', '/api/notifications/preferences'],
      ['post', '/api/notifications/preferences', { preferences: {} }],
      ['post', '/api/notifications/read/0', {}],
      ['post', '/api/notifications/read-all', {}],
      ['delete', '/api/notifications/x'],
    ];

    protectedEndpoints.forEach(([method, url, body]) => {
      it(`${method.toUpperCase()} ${url} returns 401`, async () => {
        const req = method === 'post' ? anon.post(url) : method === 'delete' ? anon.delete(url) : anon.get(url);
        const res = body && Object.keys(body).length ? await req.send(body) : await req;
        expect(res.status).to.equal(401);
      });
    });
  });
});
