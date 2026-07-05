const Database = require('better-sqlite3');
const path = require('path');

// Initialize database (use DB_PATH env var for testing)
const dbPath = process.env.DB_PATH || path.join(__dirname, 'mentally-prepare.db');
const db = new Database(dbPath);

// Performance and safety pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      college TEXT NOT NULL,
      year TEXT NOT NULL,
      gender TEXT NOT NULL,
      match_pref_gender TEXT,
      match_pref_year TEXT,
      archetype TEXT,
      ecp_scores TEXT,
      consent_given INTEGER NOT NULL DEFAULT 1,
      push_subscription TEXT,
      notif_prefs TEXT DEFAULT '{"partner_entry":true,"partner_comment":true,"match_found":true,"reveal":true,"daily_prompt":true,"system":true}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active BOOLEAN DEFAULT 1,
      FOREIGN KEY(user1_id) REFERENCES users(id),
      FOREIGN KEY(user2_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      match_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      text TEXT NOT NULL,
      mood TEXT,
      crisis_flag BOOLEAN DEFAULT 0,
      pii_flag BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(match_id, user_id, day_number),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(match_id) REFERENCES matches(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      entry_id TEXT NOT NULL,
      from_user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(entry_id) REFERENCES entries(id),
      FOREIGN KEY(from_user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reveals (
      match_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      choice TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (match_id, user_id),
      FOREIGN KEY(match_id) REFERENCES matches(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      data TEXT,
      read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      reported_day INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      order_id TEXT UNIQUE NOT NULL,
      payment_id TEXT,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      product TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS deletion_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hashed_identifier TEXT NOT NULL,
      reason TEXT,
      deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Database schema verified.');
};

initDB();

// Prepared statements
const preparedStatements = {
  // Users
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  insertUser: db.prepare('INSERT INTO users (id, name, email, password_hash, college, year, gender, consent_given, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
  updateUser: db.prepare('UPDATE users SET name = ?, email = ?, college = ?, year = ?, gender = ?, match_pref_gender = ?, match_pref_year = ?, consent_given = ?, archetype = ? WHERE id = ?'),
  updateUserPassword: db.prepare('UPDATE users SET password_hash = ? WHERE id = ?'),
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
  getAllUsers: db.prepare('SELECT * FROM users'),
  getUsersForMatching: db.prepare('SELECT id, college, year, gender, match_pref_gender, match_pref_year, archetype FROM users WHERE consent_given = 1'),

  // Matches
  insertMatch: db.prepare('INSERT INTO matches (id, user1_id, user2_id, started_at) VALUES (?, ?, ?, ?)'),
  getMatch: db.prepare('SELECT * FROM matches WHERE user1_id = ? OR user2_id = ?'),
  getActiveMatchUsers: db.prepare('SELECT u.id, u.push_subscription, m.started_at FROM matches m JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id)'),
  deleteUserMatches: db.prepare('DELETE FROM matches WHERE user1_id = ? OR user2_id = ?'),
  deleteMatch: db.prepare('DELETE FROM matches WHERE id = ?'),

  // Reveal choices
  upsertReveal: db.prepare(`
    INSERT INTO reveals (match_id, user_id, choice, created_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(match_id, user_id) DO UPDATE SET choice=excluded.choice, created_at=excluded.created_at
  `),
  getMatchReveals: db.prepare('SELECT * FROM reveals WHERE match_id = ?'),
  deleteUserReveals: db.prepare('DELETE FROM reveals WHERE user_id = ?'),

  // Entries
  upsertEntry: db.prepare(`
    INSERT INTO entries (user_id, match_id, day_number, prompt, text, mood, crisis_flag, pii_flag, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(match_id, user_id, day_number) DO UPDATE SET
      prompt=excluded.prompt, text=excluded.text, mood=excluded.mood, crisis_flag=excluded.crisis_flag, pii_flag=excluded.pii_flag, created_at=excluded.created_at
  `),
  getEntry: db.prepare('SELECT * FROM entries WHERE user_id = ? AND match_id = ? AND day_number = ?'),
  getMatchEntries: db.prepare('SELECT * FROM entries WHERE match_id = ? ORDER BY day_number ASC'),
  getUserEntries: db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY day_number ASC'),
  deleteUserEntries: db.prepare('DELETE FROM entries WHERE user_id = ?'),

  // Comments
  insertComment: db.prepare('INSERT INTO comments (id, entry_id, from_user_id, text, created_at) VALUES (?, ?, ?, ?, ?)'),
  getCommentsForEntry: db.prepare('SELECT * FROM comments WHERE entry_id = ? ORDER BY created_at ASC'),
  deleteUserComments: db.prepare('DELETE FROM comments WHERE from_user_id = ?'),

  // Reports
  insertReport: db.prepare('INSERT INTO reports (user_id, reported_day, reason, created_at) VALUES (?, ?, ?, ?)'),
  deleteUserReports: db.prepare('DELETE FROM reports WHERE user_id = ?'),

  // Payments
  insertPayment: db.prepare('INSERT INTO payments (user_id, provider, order_id, amount, currency, product, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'),
  updatePayment: db.prepare('UPDATE payments SET payment_id = ?, status = ? WHERE id = ?'),
  getPaymentByOrder: db.prepare('SELECT * FROM payments WHERE order_id = ?'),
  getUserPayments: db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC'),

  // Deletion Log
  insertDeletionLog: db.prepare('INSERT INTO deletion_log (hashed_identifier, reason, deleted_at) VALUES (?, ?, ?)'),

  // Notifications
  insertNotification: db.prepare('INSERT INTO notifications (user_id, type, title, body, data, read, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)'),
  getUserNotifications: db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'),
  getUnreadCount: db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'),
  markNotifRead: db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?'),
  markAllNotifRead: db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?'),
  deleteNotif: db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?'),
  getUserNotifPrefs: db.prepare('SELECT notif_prefs FROM users WHERE id = ?'),
  updateNotifPrefs: db.prepare('UPDATE users SET notif_prefs = ? WHERE id = ?'),
  deleteUserNotifications: db.prepare('DELETE FROM notifications WHERE user_id = ?'),

  // Waitlist
  insertWaitlist: db.prepare('INSERT INTO waitlist (email, created_at) VALUES (?, ?)'),
  getWaitlistCount: db.prepare('SELECT COUNT(*) as count FROM waitlist'),
  getWaitlistEmail: db.prepare('SELECT * FROM waitlist WHERE email = ?')
};

// --- Initialization ---

// Optional: Test connection on start
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
console.log(`[DB] Database connected correctly. Users in system: ${userCount}`);

module.exports = { db, ...preparedStatements };
