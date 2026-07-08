#!/bin/sh
# Database backup with rotation — keeps last 7 daily + 4 weekly backups.
# Usage: ./scripts/backup-db.sh [/path/to/database.db]

set -e

DB="${1:-mentally-prepare.db}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAILY=7
RETENTION_WEEKLY=4

if [ ! -f "$DB" ] && [ ! -f "$DB-wal" ]; then
  echo "No database found at $DB"
  exit 0
fi

mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d_%H%M%S)
WEEK_NUM=$(date +%U)

# Daily backup
cp "$DB" "$BACKUP_DIR/daily-$DATE.db" 2>/dev/null || true

# Remove old daily backups (keep last $RETENTION_DAILY)
ls -t "$BACKUP_DIR"/daily-*.db 2>/dev/null | tail -n +$((RETENTION_DAILY + 1)) | xargs rm -f 2>/dev/null || true

# Weekly backup (every Sunday)
if [ "$(date +%u)" = "7" ]; then
  cp "$DB" "$BACKUP_DIR/weekly-$DATE.db" 2>/dev/null || true
  ls -t "$BACKUP_DIR"/weekly-*.db 2>/dev/null | tail -n +$((RETENTION_WEEKLY + 1)) | xargs rm -f 2>/dev/null || true
fi

echo "Backup saved: $BACKUP_DIR/daily-$DATE.db"
