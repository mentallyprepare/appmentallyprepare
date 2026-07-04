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
      const res = await agent.post('/api/scan').send({ scores: { a: 1 }, archetype: 'protector' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('matched');
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
