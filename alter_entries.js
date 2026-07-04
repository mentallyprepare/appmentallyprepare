const db = require('better-sqlite3')('mentally-prepare.db');

try {
  console.log("Dropping entries table...");
  db.prepare('DROP TABLE IF EXISTS entries').run();
  
  console.log("Recreating entries table with UNIQUE constraint...");
  db.prepare(`
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
  `).run();
  console.log("Recreated entries table successfully.");
} catch (e) {
  console.error("Error modifying entries table:", e.message);
}
