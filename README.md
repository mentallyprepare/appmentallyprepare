# Mentally Prepare

A psychological operating system for social confidence and emotional resilience. Private, anonymous journaling with a structured 21-day partner connection experience.

## Tech Stack

- **Backend:** Node.js, Express 4.21
- **Database:** SQLite via better-sqlite3 (WAL mode)
- **Frontend:** Inline React 18 (UMD via CDN, transpiled in browser via Babel standalone)
- **Auth:** express-session + bcryptjs
- **Payments:** Razorpay (INR) + Stripe (USD)
- **Push:** Web Push API with VAPID keys
- **Security:** helmet, express-rate-limit

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The app runs on `http://localhost:3005`.

## Project Structure

```
├── server.js                 # Express server (all API routes + business logic)
├── db.js                     # Database schema + prepared statements
├── index.html                # Landing page SPA
├── onboarding.html           # Onboarding flow (7 screens)
├── public/
│   ├── app.html              # Main app SPA (journal, matching, profile)
│   ├── sw.js                 # Service worker
│   └── manifest.json         # PWA manifest
├── test/
│   ├── helpers.test.js       # Unit tests for utility functions
│   └── api.test.js           # Integration tests for API endpoints
└── .github/workflows/main.yml # CI pipeline
```

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/waitlist` | Join waitlist |
| POST | `/api/register` | Register account |
| POST | `/api/login` | Log in |
| POST | `/api/forgot-password` | Request password reset |
| POST | `/api/reset-password` | Reset password with token |

### Authenticated
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/me` | Get user profile, match, entries, insights |
| POST | `/api/scan` | Submit archetype scan |
| POST | `/api/entry` | Write journal entry |
| POST | `/api/comment` | Comment on partner's entry |
| POST | `/api/reveal` | Choose identity reveal (Day 21) |
| POST | `/api/report` | Report an entry |
| POST | `/api/switch-partner` | Switch partner (once) |
| GET | `/api/partner-status` | Check partner activity |
| GET | `/api/consent` | Get consent status |
| POST | `/api/consent/withdraw` | Withdraw matching consent |
| GET | `/api/my-data` | Export all user data (GDPR) |
| DELETE | `/api/account` | Delete account and all data |
| POST | `/api/pay/razorpay/create` | Create Razorpay order |
| POST | `/api/pay/razorpay/verify` | Verify Razorpay payment |
| POST | `/api/pay/stripe/create` | Create Stripe session |
| POST | `/api/pay/stripe/webhook` | Stripe webhook |
| GET | `/api/pay/history` | Payment history |

## Running Tests

```bash
npm test
```

44 tests covering:
- **Helper functions:** crisis/PII scanning, emotional theme detection, mood insights, match day calculation, adaptive prompts
- **API integration:** waitlist, registration, login, profile, scan/matching, journal entries, consent, payments, unauthenticated access on all protected endpoints

Tests use an ephemeral SQLite database — your real data is never touched.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAZORPAY_KEY_ID` | No | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | No | Razorpay API secret |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `CONTACT_EMAIL` | No | Contact email for VAPID push |
| `DB_PATH` | No | Database file path (default: `mentally-prepare.db`) |
| `NODE_ENV` | No | Set to `test` to disable rate limiting and auto-listen |
