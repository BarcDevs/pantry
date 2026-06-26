# Testing Credentials

## Clerk Test Users

| Email | Password |
|-------|----------|
| `testuser+clerk_test@example.com` | `TestPassword123!` |

Add more rows as needed — any `+clerk_test` suffix works.

## How It Works

- `+clerk_test` suffix → skips email verification (no real email sent)
- OTP/magic link code → always `424242`
- Test phone numbers → `+12015550100` through `+12015550199`, code `424242`
- Dev instance only — test mode is automatic, no config needed

## ngrok static domain

| Field | Value |
|---|---|
| Static domain | _(fill in after `ngrok config add-authtoken` + reserve a free domain)_ |
| Webhook endpoint (Clerk dashboard) | `https://<static>.ngrok-free.app/api/users/sync` |
| Dev tunnel command | `npm run tunnel` |

## E2E Tests

Call `setupClerkTestingToken()` before navigating to auth pages — bypasses bot detection.

Seeded fixtures and per-step test data will be appended here as each Playwright spec is added.
