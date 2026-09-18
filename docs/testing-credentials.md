# Testing Credentials

Auth is Auth.js (NextAuth v5) with email/password + Google. No email verification on sign-up, so any fresh email works.

## Browser verification

Sign in at `/sign-in` with `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` from `.env.local` - never commit real values here.

## E2E Tests

`e2e/helpers/auth.ts` signs up a fresh `testuser+<timestamp>@example.com` through the real UI and completes onboarding. No bot-detection bypass or test tokens needed.

Seeded fixtures and per-step test data will be appended here as each Playwright spec is added.
