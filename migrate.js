const fs = require('fs');
const path = require('path');
const db = require('./db');

const dataFile = path.join(__dirname, 'data.json');

function migrate() {
  if (!fs.existsSync(dataFile)) {
    console.log('No data.json found. You are running fresh on SQLite!');
    return;
  }

  console.log('Starting migration from data.json to SQLite...');
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch (err) {
    console.error('Failed to parse data.json:', err);
    return;
  }

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password_hash, college, year, gender, match_pref_gender, match_pref_year, consent_given, archetype, created_at)
    VALUES (@id, @name, @email, @password_hash, @college, @year, @gender, @match_pref_gender, @match_pref_year, @consent_given, @archetype, @created_at)
  `);

  const insertMatch = db.prepare(`
    INSERT OR IGNORE INTO matches (id, user1_id, user2_id, started_at, active)
    VALUES (@id, @user1_id, @user2_id, @started_at, @active)
  `);

  const insertEntry = db.prepare(`
    INSERT OR IGNORE INTO entries (id, user_id, match_id, day_number, prompt, text, mood, crisis_flag, pii_flag, created_at)
    VALUES (@id, @user_id, @match_id, @day_number, @prompt, @text, @mood, @crisis_flag, @pii_flag, @created_at)
  `);

  const migrateTx = db.transaction((parsedData) => {
    let usersCount = 0;
    let matchesCount = 0;
    let entriesCount = 0;

    if (parsedData.users) {
      for (const u of parsedData.users) {
        insertUser.run({
          ...u,
          consent_given: u.consent_given ? 1 : 0
        });
        usersCount++;
      }
    }

    if (parsedData.matches) {
      for (const m of parsedData.matches) {
        insertMatch.run({
          ...m,
          active: m.active !== false ? 1 : 0
        });
        matchesCount++;
      }
    }

    if (parsedData.entries) {
      for (const e of parsedData.entries) {
        insertEntry.run({
          ...e,
          crisis_flag: e.crisis_flag ? 1 : 0,
          pii_flag: e.pii_flag ? 1 : 0
        });
        entriesCount++;
      }
    }

    return { usersCount, matchesCount, entriesCount };
  });

  try {
    const stats = migrateTx(data);
    console.log(`Migration successful! Migrated ${stats.usersCount} users, ${stats.matchesCount} matches, and ${stats.entriesCount} entries.`);
    
    fs.renameSync(dataFile, path.join(__dirname, 'data.json.migrated'));
    console.log('Original data.json safely renamed to data.json.migrated');
  } catch (err) {
    console.error('Migration failed rolling back transaction:', err);
  }
}

migrate();
