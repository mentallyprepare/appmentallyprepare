const express = require('express');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const webpush = require('web-push');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const userRoutes = require('./routes/user');
const matchingRoutes = require('./routes/matching');
const paymentsRoutes = require('./routes/payments');
const pushRoutes = require('./routes/push');
const analyzeRoutes = require('./routes/analyze');
const notificationRoutes = require('./routes/notifications');
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');

const app = express();

const PROD = process.env.NODE_ENV === 'production';

// Trust proxy when behind a reverse proxy (Heroku, Railway, etc.)
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', parseInt(process.env.TRUST_PROXY) || 1);
}

// ─── Compression ──────────────────────────
app.use(compression({ level: 6, threshold: 256 }));

// ─── CORS ─────────────────────────────────────
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3005'];
app.use(cors({
  origin: PROD ? ALLOWED_ORIGINS : true,
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: PROD ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.razorpay.com', 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://checkout.razorpay.com', 'https://js.stripe.com'],
    },
  } : false,
  // Allow embedding in iframes (needed for Replit preview)
  frameguard: false,
}));

// Tiered rate limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts, try again later' } });
const genLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const strictLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Rate limit exceeded' } });
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);
  app.use('/api/forgot-password', authLimiter);
  app.use('/api/reset-password', authLimiter);
  app.use('/api/analyze', strictLimiter);
  app.use('/api/', genLimiter);
}

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: PROD ? '1y' : 0 }));
app.use(express.json({ limit: '50kb' }));

// ─── Session ──────────────────────────────────
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: PROD,
    sameSite: PROD ? 'lax' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// ─── Env Validation ──────────────────────────
const requiredVars = [];
const optionalVars = [
  { key: 'BASE_URL', desc: 'Public URL (used for reset-password links)' },
  { key: 'CONTACT_EMAIL', desc: 'Contact email for VAPID/web-push' },
  { key: 'OPENAI_API_KEY', desc: 'OpenAI key for LLM analysis' },
  { key: 'ANTHROPIC_API_KEY', desc: 'Anthropic key for LLM analysis' },
  { key: 'EMAIL_HOST', desc: 'SMTP host for transactional emails' },
  { key: 'SESSION_SECRET', desc: 'Persistent session secret (auto-generated if missing)' },
  { key: 'CORS_ORIGINS', desc: 'Comma-separated allowed origins for CORS' },
  { key: 'TRUST_PROXY', desc: 'Number of proxy hops to trust' },
  { key: 'ADMIN_EMAIL', desc: 'Email to seed as admin (requires ADMIN_PASSWORD)' },
  { key: 'ADMIN_PASSWORD', desc: 'Password for admin user' },
];
if (process.env.NODE_ENV !== 'test') {
  for (const v of requiredVars) {
    if (!process.env[v.key]) console.warn(`  ⚠ Missing required env: ${v.key} — ${v.desc}`);
  }
  for (const v of optionalVars) {
    if (!process.env[v.key]) console.log(`  ℹ Optional env not set: ${v.key} — ${v.desc}`);
  }
}

// ─── Web Push Setup ─────────────────────
const VAPID_PATH = path.join(__dirname, '..', '.vapid-keys.json');
let vapidKeys;
try {
  if (fs.existsSync(VAPID_PATH)) {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_PATH, 'utf8'));
  } else {
    vapidKeys = webpush.generateVAPIDKeys();
    fs.writeFileSync(VAPID_PATH, JSON.stringify(vapidKeys, null, 2));
    console.log('  ✓ Generated VAPID keys');
  }
  webpush.setVapidDetails(
    'mailto:' + (process.env.CONTACT_EMAIL || 'hello@mentallyprepare.in'),
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
} catch (e) {
  console.error('  ✗ VAPID setup failed:', e.message);
}
app.set('vapidKeys', vapidKeys);

// ─── Razorpay Setup ─────────────────────
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('  ✓ Razorpay configured');
}
app.set('razorpay', razorpay);

// ─── Stripe Setup ───────────────────────
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  console.log('  ✓ Stripe configured');
}
app.set('stripe', stripe);

// ─── Routes ─────────────────────────────
app.use('/api', authRoutes);
app.use('/api', journalRoutes);
app.use('/api', userRoutes);
app.use('/api', matchingRoutes);
app.use('/api/pay', paymentsRoutes);
app.use('/api/push', pushRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', notificationRoutes);
app.use('/api', healthRoutes);
app.use('/api/admin', adminRoutes);

// ─── Frontend Routes ────────────────────
const appHtml        = path.join(__dirname, '..', 'public', 'app.html');
const onboardingHtml = path.join(__dirname, '..', 'onboarding.html');

app.get('/', (req, res) => res.redirect('/app'));
app.get('/onboarding', (req, res) => res.sendFile(onboardingHtml));
app.get('/app',        (req, res) => res.sendFile(appHtml));
app.get('/app/*',      (req, res) => res.sendFile(appHtml));
app.get('/quiz',       (req, res) => res.sendFile(appHtml));
app.get('/archetype/:type', (req, res) => res.sendFile(appHtml));
app.get('/match-day',  (req, res) => res.sendFile(appHtml));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'razorpay-checkout.html')));

// ─── 404 handler ───────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
});

// ─── Error handling middleware ─────────────
app.use((err, req, res, _next) => {
  console.error('  ✗ Unhandled error:', err.message || err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ─── Daily Push Reminders ───────────────
function sendDailyReminders() {
  if (!vapidKeys) return;
  const stmts = require('../db');
  const rows = stmts.getActiveMatchUsers ? stmts.getActiveMatchUsers.all() : [];
  let sent = 0, failed = 0;
  for (const row of rows) {
    if (!row.push_subscription) continue;
    const { getMatchDay } = require('./utils/matching');
    const day = getMatchDay(row.started_at);
    if (day > 21) continue;
    try {
      const sub = JSON.parse(row.push_subscription);
      const payload = JSON.stringify({
        title: 'Your prompt is waiting ✦',
        body: `Day ${day} of 21 — take 5 minutes to be honest.`,
        url: '/app'
      });
      webpush.sendNotification(sub, payload).then(() => { sent++; }).catch(err => {
        failed++;
        if (err.statusCode === 410 || err.statusCode === 404) {
          require('../db').db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(null, row.id);
        }
      });
    } catch { failed++; }
  }
  console.log(`  📬 Daily reminders: ${sent} sent, ${failed} failed`);
}

function scheduleDailyPush() {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(14, 30, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();
  setTimeout(() => {
    sendDailyReminders();
    setInterval(sendDailyReminders, 24 * 60 * 60 * 1000);
  }, delay);
  console.log(`  ⏰ Daily push scheduled for 8:00 PM IST (in ${Math.round(delay / 60000)} min)`);
}
scheduleDailyPush();

module.exports = app;
