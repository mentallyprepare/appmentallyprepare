const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
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

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', limiter);
}

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'strict' }
}));

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

// ─── Frontend Routes ────────────────────
const indexHtml = path.join(__dirname, '..', 'public', 'index.html');
app.get('/', (req, res) => res.sendFile(indexHtml));
app.get('/onboarding', (req, res) => res.sendFile(indexHtml));
app.get('/app', (req, res) => res.sendFile(indexHtml));
app.get('/app/*', (req, res) => res.sendFile(indexHtml));
app.get('/quiz', (req, res) => res.sendFile(indexHtml));
app.get('/archetype/:type', (req, res) => res.sendFile(indexHtml));
app.get('/match-day', (req, res) => res.sendFile(indexHtml));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')));

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
