const db = require('better-sqlite3')('mentally-prepare.db');

try {
  console.log("Adding push_subscription...");
  db.prepare('ALTER TABLE users ADD COLUMN push_subscription TEXT').run();
  console.log("Success.");
} catch (e) {
  console.log("push_subscription might already exist:", e.message);
}

try {
  console.log("Adding ecp_scores...");
  db.prepare('ALTER TABLE users ADD COLUMN ecp_scores TEXT').run();
  console.log("Success.");
} catch (e) {
  console.log("ecp_scores might already exist:", e.message);
}

console.log("Done.");
