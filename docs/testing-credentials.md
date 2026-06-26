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

## E2E Tests

Call `setupClerkTestingToken()` before navigating to auth pages — bypasses bot detection.
