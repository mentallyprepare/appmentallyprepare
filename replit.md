# Mentally Prepare

A psychological operating system for social confidence and emotional resilience. Private, anonymous journaling with a structured 21-day partner connection experience.

## How to run

The app starts automatically via the **Start application** workflow (`npm start`). It serves on port 5000.

## Tech stack

- **Backend:** Node.js, Express 4.21
- **Database:** SQLite via better-sqlite3 (WAL mode, file: `mentally-prepare.db`)
- **Frontend:** Inline React 18 (UMD via CDN, transpiled in-browser via Babel standalone)
- **Auth:** express-session + bcryptjs
- **Payments:** Razorpay (INR) + Stripe (USD) — both optional; app runs without them
- **Push:** Web Push API with VAPID keys (auto-generated on first run, saved to `.vapid-keys.json`)
- **Security:** helmet, express-rate-limit

## Project structure

```
├── server.js                  # Entry point — starts the server
├── db.js                      # SQLite schema + prepared statements
├── src/
│   ├── app.js                 # Express app setup, middleware, route wiring
│   ├── config/constants.js    # Prompts, keywords, PORT (default 5000)
│   ├── routes/                # auth, journal, user, matching, payments, push, analyze, notifications
│   └── utils/                 # safety, themes, mood, matching helpers
├── index.html                 # Landing page
├── onboarding.html            # 7-screen onboarding flow
├── public/
│   ├── app.html               # Main app SPA (journal, matching, profile)
│   ├── sw.js                  # Service worker
│   └── manifest.json          # PWA manifest
└── test/                      # Mocha tests (npm test)
```

## Environment variables / secrets

| Variable | Required | Description |
|---|---|---|
| `SESSION_SECRET` | **Yes** | Express session secret — set in Replit Secrets |
| `RAZORPAY_KEY_ID` | No | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | No | Razorpay API secret |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `CONTACT_EMAIL` | No | Email for VAPID push (default: hello@mentallyprepare.in) |
| `DB_PATH` | No | SQLite file path (default: mentally-prepare.db) |
| `PORT` | No | HTTP port (default: 5000) |

## Running tests

```bash
npm test
```

44 tests covering helper functions and API endpoints. Uses an ephemeral in-memory SQLite DB — real data is never touched.

## User preferences
