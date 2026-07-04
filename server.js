const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', limiter);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const webpush = require('web-push');

const dbMod = require('./db');
const db = dbMod.db; // The better-sqlite3 instance
const stmts = dbMod; // The prepared statements

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    sameSite: 'strict' 
  }
}));

// ─── Web Push Setup ─────────────────────
const VAPID_PATH = path.join(__dirname, '.vapid-keys.json');
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

// ─── Stripe Setup ───────────────────────
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  console.log('  ✓ Stripe configured');
}

// API Routes
app.post('/api/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const existing = stmts.getWaitlistEmail.get(email.toLowerCase().trim());
    if (existing) {
      return res.json({ status: 'ok', message: 'Already on the waitlist!', count: stmts.getWaitlistCount.get().count });
    }

    stmts.insertWaitlist.run(email.toLowerCase().trim(), new Date().toISOString());
    const count = stmts.getWaitlistCount.get().count;
    res.json({ status: 'ok', message: 'Joined the waitlist!', count });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.json({ status: 'ok', message: 'Already on the waitlist!', count: stmts.getWaitlistCount.get().count });
    }
    console.error('Waitlist error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, college, year, gender, match_pref_gender, match_pref_year, consentGiven } = req.body;
  
  if (!consentGiven) return res.status(400).json({ error: 'Consent must be given' });
  
  const id = crypto.randomUUID();
  const password_hash = await bcrypt.hash(password, 12);
  
  try {
    stmts.insertUser.run(id, name, email, password_hash, college, year, gender, 1, new Date().toISOString());
    
    req.session.userId = id;
    res.json({ status: 'ok', user: { id, name, email } });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = stmts.getUserByEmail.get(email);
  
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.userId = user.id;
  res.json({ status: 'ok', user: { id: user.id, name: user.name, email: user.email } });
});

// ─── Prompts & Helpers ────────────────────────────
const prompts = [
  '"What\'s one thing you wish someone would just ask you about?"',
  '"What did you hide today because it felt too small to explain?"',
  '"When do you become distant, even when you want closeness?"',
  '"What are you tired of carrying alone?"',
  '"Where do you make yourself smaller to stay accepted?"',
  '"What truth would you write if nobody judged it?"',
  '"What moment made you feel seen, even a little?"',
  '"What does emotional effort look like to you?"',
  '"What kind of connection are you ready for now?"',
  '"What\'s the last thing that genuinely moved you?"',
  '"If you could say one honest thing to someone you\'ve lost touch with, what would it be?"',
  '"What are you pretending isn\'t affecting you?"',
  '"When was the last time you let someone see the real version of you?"',
  '"What part of yourself do you think people misread?"',
  '"What would it look like if you stopped performing?"',
  '"What scares you about being known?"',
  '"If your loneliness had a shape, what would it look like?"',
  '"What\'s one boundary you need but can\'t set?"',
  '"What is the thing you most want someone to understand about you?"',
  '"Write a letter to the person you\'ll meet on Day 21."',
  '"Would you like to know who has been writing to you?"'
];

const SAFETY_KEYWORDS = [
  'suicide','kill myself','end my life','want to die','self harm','self-harm',
  'cutting myself','overdose','no reason to live','can\'t go on',
  'hurt myself','ending it all','take my life','not worth living'
];

const CONTENT_FLAGS = [
  'instagram','snapchat','whatsapp','phone number','@gmail','@yahoo',
  'my number is','call me at','dm me','follow me'
];

const HELPLINES = {
  iCall: '9152987821',
  vandrevala: '1860-2662-345',
  nimhans: '080-46110007'
};

function scanForSafety(text) {
  const lower = text.toLowerCase();
  const crisis = SAFETY_KEYWORDS.some(kw => lower.includes(kw));
  const pii = CONTENT_FLAGS.some(kw => lower.includes(kw));
  return { crisis, pii };
}

const EMOTIONAL_THEMES = {
  isolation: {
    keywords: ['alone','lonely','isolated','nobody','no one','invisible','ignored','forgotten','empty','hollow','left out'],
    prompts: [
      '"What does your loneliness feel like when it\'s at its loudest?"',
      '"If loneliness were a room, what would yours look like?"',
      '"Who was the last person who made you feel less alone — and what exactly did they do?"'
    ]
  },
  family: {
    keywords: ['mom','dad','mother','father','parents','family','sibling','brother','sister','home','childhood'],
    prompts: [
      '"What\'s one conversation with your family you keep replaying?"',
      '"What did your parents teach you about emotions — without saying a word?"',
      '"If you could rewrite one rule from how you grew up, what would it be?"'
    ]
  },
  self_worth: {
    keywords: ['not good enough','worthless','failure','imposter','fake','pretend','doubt myself','not enough','inadequate','deserve'],
    prompts: [
      '"Where did you first learn that you weren\'t enough?"',
      '"What would change if you believed you deserved the good things?"',
      '"Write about a moment you were genuinely proud of yourself — even if you never told anyone."'
    ]
  },
  fear: {
    keywords: ['scared','afraid','fear','anxious','panic','worry','terrified','nervous','dread','overwhelm'],
    prompts: [
      '"What\'s the fear behind the fear — the deeper one you don\'t usually name?"',
      '"If your anxiety could speak honestly, what would it say it\'s trying to protect you from?"',
      '"What would you do tomorrow if fear wasn\'t a factor?"'
    ]
  },
  hope: {
    keywords: ['hope','better','dream','someday','future','wish','imagine','possible','light','grateful','thankful'],
    prompts: [
      '"What small thing is quietly giving you hope right now?"',
      '"Write about the version of yourself you\'re slowly becoming."',
      '"What\'s one thing you\'re learning to trust again?"'
    ]
  },
  anger: {
    keywords: ['angry','frustrated','rage','unfair','hate','furious','tired of','sick of','fed up','resentment'],
    prompts: [
      '"What are you angry about that you haven\'t let yourself fully feel yet?"',
      '"What boundary would your anger set if you actually listened to it?"',
      '"Behind your frustration — what do you actually need?"'
    ]
  },
  grief: {
    keywords: ['miss','lost','gone','grief','mourning','death','passed away','used to be','remember when','nostalgia'],
    prompts: [
      '"What are you grieving that nobody around you sees?"',
      '"Write about something you lost that changed who you are."',
      '"If you could have one more conversation with someone you\'ve lost, what would you say?"'
    ]
  },
  connection: {
    keywords: ['friend','close','trust','open up','vulnerable','bond','deep','Understand','listen','seen','heard'],
    prompts: [
      '"What makes someone safe enough to be real with?"',
      '"Describe a moment where you felt truly heard — what made it different?"',
      '"What\'s the kindest thing someone could do for you right now without you having to ask?"'
    ]
  },
  pressure: {
    keywords: ['pressure','expectations','perfect','grades','career','perform','compete','comparison','achievement','success','burnout'],
    prompts: [
      '"Whose voice is loudest when you feel like you\'re not doing enough?"',
      '"What would rest actually look like if you gave yourself permission?"',
      '"What if being ordinary was allowed — what would you do differently?"'
    ]
  }
};

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

const complementary = {
  protector: 'connector', connector: 'protector',
  performer: 'disconnector', disconnector: 'performer'
};

function attemptMatch(userId) {
  const user = stmts.getUserById.get(userId);
  if (!user || !user.archetype) return null;
  const targetType = complementary[user.archetype];
  if (!targetType) return null;

  let candidates = stmts.getUsersForMatching.all().filter(c => c.archetype === targetType && c.college.toLowerCase() !== user.college.toLowerCase() && c.id !== userId);
  
  // Exclude ones already matched
  candidates = candidates.filter(c => !stmts.getMatch.get(c.id, c.id));

  // Gender preference filtering
  if (user.match_pref_gender && user.match_pref_gender !== 'any') {
    const filtered = candidates.filter(c => c.gender === user.match_pref_gender);
    if (filtered.length > 0) candidates = filtered;
  }
  candidates = candidates.filter(c => {
    if (!c.match_pref_gender || c.match_pref_gender === 'any') return true;
    return c.match_pref_gender === user.gender;
  });

  // Year preference filtering (soft)
  if (user.match_pref_year && user.match_pref_year !== 'any') {
    const yearNums = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '5th+': 5 };
    let yearFiltered;
    if (user.match_pref_year === '±1_year' || user.match_pref_year === 'nearby') {
      const userYearNum = yearNums[user.year] || 3;
      yearFiltered = candidates.filter(c => Math.abs((yearNums[c.year] || 3) - userYearNum) <= 1);
    } else {
      yearFiltered = candidates.filter(c => c.year === user.match_pref_year);
    }
    if (yearFiltered.length > 0) candidates = yearFiltered;
  }

  const partner = candidates[0] || null;
  if (partner) {
    stmts.insertMatch.run(crypto.randomUUID(), userId, partner.id, new Date().toISOString());
    return true;
  }
  return null;
}

function getMatchDay(startedAt) {
  const started = new Date(startedAt);
  const now = new Date();
  const startDay = Date.UTC(started.getUTCFullYear(), started.getUTCMonth(), started.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.min(Math.max(Math.floor((today - startDay) / 86400000) + 1, 1), 21);
}

function getPartnerId(match, userId) {
  return match.user1_id === userId ? match.user2_id : match.user1_id;
}


// ─── App Routes ───────────────────────────
app.post('/api/scan', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { scores, archetype } = req.body;
    if (!archetype || !scores) return res.status(400).json({ error: 'Scan data required' });
    const validTypes = ['protector', 'connector', 'performer', 'disconnector'];
    if (!validTypes.includes(archetype)) return res.status(400).json({ error: 'Invalid archetype' });

    const userId = req.session.userId;
    const existingMatch = stmts.getMatch.get(userId, userId);
    if (existingMatch) return res.status(400).json({ error: 'Cannot retake scan after matching' });

    const user = stmts.getUserById.get(userId);
    stmts.updateUser.run(user.name, user.email, user.college, user.year, user.gender, user.match_pref_gender, user.match_pref_year, user.consent_given, archetype, userId);
    
    // Attempt match
    const matched = attemptMatch(userId);
    res.json({ ok: true, matched: !!matched });
  } catch (e) {
    console.error('Scan error:', e);
    res.status(500).json({ error: 'Failed to save scan' });
  }
});

app.post('/api/entry', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { text, mood } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Entry text required' });
    if (text.length > 5000) return res.status(400).json({ error: 'Entry too long (max 5000 chars)' });

    const safety = scanForSafety(text);

    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });

    const day = getMatchDay(match.started_at);
    if (day > 21) return res.status(400).json({ error: 'Journey complete' });

    const prompt = prompts[(day - 1) % prompts.length];
    stmts.upsertEntry.run(userId, match.id, day, prompt, text.trim(), mood || '🌓', safety.crisis ? 1 : 0, safety.pii ? 1 : 0, new Date().toISOString());

    res.json({ ok: true, day, safety: { crisis: safety.crisis, pii: safety.pii, helplines: safety.crisis ? HELPLINES : null } });
  } catch (e) {
    console.error('Entry error:', e);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

app.get('/api/partner-status', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.json({ hasPartner: false });

    const partnerId = getPartnerId(match, userId);
    const partnerCount = stmts.getUserEntries.all(partnerId).length;
    // We mock inactivity for now since we omitted the last_active database column in the newer schema
    const daysSinceActive = 0;

    res.json({
      hasPartner: true, daysSinceActive, partnerEntryCount: partnerCount,
      canSwitch: daysSinceActive >= 5,
      status: 'active'
    });
  } catch (e) {
    console.error('Partner status error:', e);
    res.status(500).json({ error: 'Failed to check partner status' });
  }
});

app.post('/api/switch-partner', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No current match to switch from' });

    stmts.deleteMatch.run(match.id);
    const newMatch = attemptMatch(userId);
    res.json({ ok: true, matched: !!newMatch, switchesRemaining: 1 });
  } catch (e) {
    console.error('Switch error:', e);
    res.status(500).json({ error: 'Failed to switch partner' });
  }
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ error: 'User removed' });
    }

    const safeUser = {
      name: user.name,
      email: user.email,
      college: user.college,
      year: user.year,
      archetype: user.archetype,
      scores: user.scores ? JSON.parse(user.scores) : null,
      gender: user.gender,
      matchPrefGender: user.match_pref_gender,
      matchPrefYear: user.match_pref_year
    };

    const match = stmts.getMatch.get(userId, userId);
    let matchData = null, entriesData = [], partnerEntries = [], streak = 0, revealData = null, comments = [];

    if (match) {
      const partnerId = getPartnerId(match, userId);
      const day = getMatchDay(match.started_at);
      const partner = stmts.getUserById.get(partnerId);

      matchData = {
        id: match.id, day,
        currentPrompt: prompts[(day - 1) % prompts.length],
        partner: partner ? { archetype: partner.archetype, scores: partner.scores ? JSON.parse(partner.scores) : null } : null,
        startedAt: match.started_at
      };

      entriesData = stmts.getUserEntries.all(userId);
      partnerEntries = stmts.getMatchEntries.all(match.id).filter(e => e.user_id !== userId && e.day_number < day);

      const allComments = stmts.getCommentsForEntry.all(match.id);
      comments = allComments.map(c => ({
        day: c.day, text: c.text,
        from: c.user_id === userId ? 'me' : 'partner',
        created_at: c.created_at
      }));

      const entryDays = new Set(entriesData.map(e => e.day));
      if (entryDays.has(day)) streak++;
      for (let d = day - 1; d >= 1; d--) {
        if (entryDays.has(d)) streak++; else break;
      }

      if (day >= 21) {
        const myReveal = stmts.getMatchReveals.all(match.id).find(r => r.user_id === userId);
        const partnerReveal = stmts.getMatchReveals.all(match.id).find(r => r.user_id === partnerId);
        const bothYes = myReveal && myReveal.choice === 'yes' && partnerReveal && partnerReveal.choice === 'yes';
        const eitherNo = (myReveal && myReveal.choice === 'no') || (partnerReveal && partnerReveal.choice === 'no');

        revealData = {
          available: true,
          myChoice: myReveal ? myReveal.choice : null,
          partnerChose: !!partnerReveal,
          revealed: bothYes,
          anonymous: eitherNo,
          partner: bothYes && partner ? { name: partner.name, college: partner.college, year: partner.year } : null
        };
      }
    }

    let adaptivePrompt = null;
    if (match && entriesData.length >= 2) {
      const day = getMatchDay(match.started_at);
      adaptivePrompt = getAdaptivePrompt(entriesData, day);
    }

    const insights = entriesData.length >= 3 ? getMoodInsights(entriesData) : null;

    res.json({ status: 'ok', user: safeUser, match: matchData, entries: entriesData, partnerEntries, streak, reveal: revealData, comments, adaptivePrompt, insights });
  } catch (err) {
    console.error('Error in /api/me:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/comment', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { day, text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });
    if (text.length > 500) return res.status(400).json({ error: 'Comment too long (max 500 chars)' });
    if (!day || day < 1 || day > 21) return res.status(400).json({ error: 'Invalid day' });

    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });

    const currentDay = getMatchDay(match.started_at);
    if (day >= currentDay) return res.status(400).json({ error: 'That entry is still sealed' });

    const partnerId = getPartnerId(match, userId);
    const partnerEntry = stmts.getEntry.get(partnerId, match.id, day);
    if (!partnerEntry) return res.status(400).json({ error: 'No partner entry to comment on' });

    stmts.insertComment.run(crypto.randomUUID(), partnerEntry.id, userId, text.trim(), new Date().toISOString());
    res.json({ ok: true });
  } catch (e) {
    console.error('Comment error:', e);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

app.post('/api/reveal', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { choice } = req.body;
    if (choice !== 'yes' && choice !== 'no') return res.status(400).json({ error: 'Choice must be yes or no' });

    const match = stmts.getMatch.get(userId, userId);
    if (!match) return res.status(400).json({ error: 'No match found' });

    const day = getMatchDay(match.started_at);
    if (day < 21) return res.status(400).json({ error: 'Not yet Day 21' });

    stmts.upsertReveal.run(match.id, userId, choice, new Date().toISOString());
    res.json({ ok: true });
  } catch (e) {
    console.error('Reveal error:', e);
    res.status(500).json({ error: 'Failed to save reveal choice' });
  }
});


app.post('/api/report', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const { day, reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ error: 'Reason required' });
    stmts.insertReport.run(userId, day || 0, reason.trim().substring(0, 500), new Date().toISOString());
    res.json({ ok: true });
  } catch (e) {
    console.error('Report error:', e);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

const resetTokens = new Map();

app.post('/api/forgot-password', limiter, (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = stmts.getUserByEmail.get(email.toLowerCase().trim());
    if (!user) return res.json({ ok: true, message: 'If that email exists, a reset code has been generated.' });

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, { userId: user.id, expires: Date.now() + 15 * 60 * 1000 });
    console.log(`  ✉ Password reset token for ${user.email}: ${token}`);
    res.json({ ok: true, message: 'If that email exists, a reset link has been generated.' });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/reset-password', limiter, async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    const token = code;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const entry = resetTokens.get(token);
    if (!entry || entry.expires < Date.now()) {
      if (token) resetTokens.delete(token);
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = stmts.getUserById.get(entry.userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const hash = await bcrypt.hash(newPassword, 12);
    stmts.updateUserPassword.run(hash, user.id);
    resetTokens.delete(token);
    res.json({ ok: true });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.get('/api/my-data', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = stmts.getMatch.get(userId, userId);
    const myEntries = stmts.getUserEntries.all(userId)
      .map(e => ({ day: e.day_number, prompt: e.prompt, text: e.text, mood: e.mood, written_at: e.created_at }));
    
    // Fallback gracefully since properties might have changed in migration
    let myReveals = [];
    if (stmts.getMatchReveals && match) {
       myReveals = stmts.getMatchReveals.all(match.id).filter(r => r.user_id === userId)
         .map(r => ({ match_id: r.match_id, choice: r.choice, decided_at: r.created_at }));
    }
    
    const myComments = db.prepare('SELECT c.text, c.created_at, e.day_number as day FROM comments c JOIN entries e ON c.entry_id = e.id WHERE c.from_user_id = ?').all(userId)
      .map(c => ({ day: c.day, text: c.text, written_at: c.created_at }));

    const exportData = {
      exported_at: new Date().toISOString(),
      notice: 'This is all personal data Mentally Prepare holds about you. Partner details are excluded to protect their privacy.',
      profile: {
        name: user.name, email: user.email, college: user.college, year: user.year,
        gender: user.gender, matchGenderPref: user.match_pref_gender, matchYearPref: user.match_pref_year,
        archetype: user.archetype, scores: user.scores ? JSON.parse(user.scores) : null,
        consentGiven: !!user.consent_given,
        accountCreated: user.created_at
      },
      match: match ? { status: 'active', dayCount: getMatchDay(match.started_at) } : null,
      journal_entries: myEntries,
      comments: myComments,
      reveal_choices: myReveals
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="my-mentally-prepare-data.json"');
    res.json(exportData);
  } catch (e) {
    console.error('Data export error:', e);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

app.delete('/api/account', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password confirmation required to delete account' });

    const userId = req.session.userId;
    const user = stmts.getUserById.get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) return res.status(401).json({ error: 'Incorrect password. Account not deleted.' });

    const deleteAll = db.transaction(() => {
      stmts.insertDeletionLog.run(
        crypto.createHash('sha256').update(String(userId)).digest('hex').slice(0, 16),
        'user_requested',
        new Date().toISOString()
      );
      if (stmts.deleteUserEntries) stmts.deleteUserEntries.run(userId);
      if (stmts.deleteUserReveals) stmts.deleteUserReveals.run(userId);
      if (stmts.deleteUserComments) stmts.deleteUserComments.run(userId);
      if (stmts.deleteUserReports) stmts.deleteUserReports.run(userId);
      if (stmts.deleteUserMatches) stmts.deleteUserMatches.run(userId, userId);
      stmts.deleteUser.run(userId);
    });
    deleteAll();

    req.session.destroy(() => {
      res.json({ ok: true, message: 'Your account and all associated data has been permanently deleted.' });
    });
  } catch (e) {
    console.error('Account deletion error:', e);
    res.status(500).json({ error: 'Account deletion failed' });
  }
});

app.get('/api/consent', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = stmts.getUserById.get(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // SQLite stores 1/0 for boolean
    res.json({ consentGiven: user.consent_given === 1, consentDate: user.created_at || null });
  } catch (e) {
    res.status(500).json({ error: 'Failed to check consent' });
  }
});

app.post('/api/consent/withdraw', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = stmts.getUserById.get(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    stmts.updateUser.run(user.name, user.email, user.college, user.year, user.gender, user.match_pref_gender, user.match_pref_year, 0, user.archetype, user.id);
    res.json({ ok: true, message: 'Consent withdrawn. You can still export or delete your data.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to withdraw consent' });
  }
});

app.get('/api/push/public-key', (req, res) => {
  if (!vapidKeys) return res.status(503).json({ error: 'Push not configured' });
  res.json({ publicKey: vapidKeys.publicKey });
});

app.post('/api/push/subscribe', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
    db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(JSON.stringify(subscription), req.session.userId);
    res.json({ ok: true });
  } catch (e) {
    console.error('Push subscribe error:', e);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

app.post('/api/push/unsubscribe', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(null, req.session.userId);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

function sendDailyReminders() {
  if (!vapidKeys) return;
  const rows = stmts.getActiveMatchUsers ? stmts.getActiveMatchUsers.all() : [];
  let sent = 0, failed = 0;

  for (const row of rows) {
    if (!row.push_subscription) continue;
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
          db.prepare('UPDATE users SET push_subscription = ? WHERE id = ?').run(null, row.id);
        }
      });
    } catch { failed++; }
  }
  console.log(`  📬 Daily reminders: ${sent} sent, ${failed} failed`);
}

function scheduleDailyPush() {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(14, 30, 0, 0); // 8:00 PM IST
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    sendDailyReminders();
    setInterval(sendDailyReminders, 24 * 60 * 60 * 1000);
  }, delay);

  console.log(`  ⏰ Daily push scheduled for 8:00 PM IST (in ${Math.round(delay / 60000)} min)`);
}
scheduleDailyPush();

app.post('/api/pay/razorpay/create', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (!razorpay) return res.status(503).json({ error: 'Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });

    const { product } = req.body;
    const products = {
      'archetype-pdf': { amount: 99900, name: 'Connection Profile PDF', currency: 'INR' },
      'second-cycle': { amount: 49900, name: 'Second 21-Day Cycle', currency: 'INR' }
    };
    const p = products[product];
    if (!p) return res.status(400).json({ error: 'Invalid product' });

    razorpay.orders.create({
      amount: p.amount,
      currency: p.currency,
      receipt: 'mp_' + Date.now(),
      notes: { product, userId: String(req.session.userId) }
    }).then(order => {
      const result = stmts.insertPayment.run(req.session.userId, 'razorpay', order.id, p.amount, p.currency, product, 'created', new Date().toISOString());
      res.json({
        orderId: order.id,
        amount: p.amount,
        currency: p.currency,
        name: p.name,
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: Number(result.lastInsertRowid)
      });
    }).catch(err => {
      res.status(500).json({ error: 'Failed to create order' });
    });
  } catch (e) {
    console.error('Razorpay create error:', e);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/pay/razorpay/verify', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (!razorpay) return res.status(503).json({ error: 'Razorpay not configured' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const payment = stmts.getPaymentByOrder.get(razorpay_order_id);
    if (payment) {
      stmts.updatePayment.run(razorpay_payment_id, 'paid', payment.id);
    }

    res.json({ ok: true, verified: true });
  } catch (e) {
    console.error('Razorpay verify error:', e);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.post('/api/pay/stripe/create', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (!stripe) return res.status(503).json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' });

    const { product } = req.body;
    const products = {
      'archetype-pdf': { amount: 1200, name: 'Connection Profile PDF', currency: 'usd' },
      'second-cycle': { amount: 600, name: 'Second 21-Day Cycle', currency: 'usd' }
    };
    const p = products[product];
    if (!p) return res.status(400).json({ error: 'Invalid product' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: p.currency,
          product_data: { name: p.name, description: 'Mentally Prepare — ' + p.name },
          unit_amount: p.amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: req.header('origin') + '/app?payment=success',
      cancel_url: req.header('origin') + '/app?payment=cancelled',
      metadata: { product, userId: String(req.session.userId) }
    });

    const result = stmts.insertPayment.run(req.session.userId, 'stripe', session.id, p.amount, p.currency, product, 'created', new Date().toISOString());

    res.json({ url: session.url, paymentId: Number(result.lastInsertRowid) });
  } catch (e) {
    console.error('Stripe create error:', e);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/api/pay/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send();

    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send('Webhook signature verification failed');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = stmts.getPaymentByOrder.get(session.id);
      if (payment) {
        stmts.updatePayment.run(session.payment_intent, 'paid', payment.id);
      }
    }

    res.json({ received: true });
  } catch (e) {
    console.error('Stripe webhook error:', e);
    res.status(500).send();
  }
});

app.get('/api/pay/history', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payments = stmts.getUserPayments.all(req.session.userId)
      .map(p => ({ id: p.id, product: p.product, amount: p.amount, currency: p.currency, status: p.status, provider: p.provider, created_at: p.created_at }));
    res.json({ payments });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load payment history' });
  }
});

const PORT = 3005;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\nMentally Prepare app running on http://localhost:${PORT}`);
  });
}

module.exports = { app, scanForSafety, detectThemes, getAdaptivePrompt, getMoodInsights, attemptMatch, getMatchDay, getPartnerId, prompts, HELPLINES, EMOTIONAL_THEMES, SAFETY_KEYWORDS, CONTENT_FLAGS };
