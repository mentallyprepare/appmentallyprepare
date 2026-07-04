const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'mentally-prepare.db');
const backupDir = path.join(__dirname, 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `mentally-prepare-${dateStr}.db`);

try {
  if (fs.existsSync(dbFile)) {
    // Note: in a production setting with WAL, you should use SQLite's native backup API
    // but a filesystem copy is fine as a simple automated fallback for this trial phase.
    fs.copyFileSync(dbFile, backupFile);
    console.log(`Successfully backed up database to ${backupFile}`);
  } else {
    console.log('No database found to back up yet.');
  }
} catch (err) {
  console.error('Backup failed:', err);
}
