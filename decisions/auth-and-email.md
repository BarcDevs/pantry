# Auth & Email

Password-reset flow and transactional-email decisions.

---

## 27/09/2026 — No copy-to-clipboard button in the password-reset email

**Context:** while reviewing the password-reset email (`src/lib/email/templates/password-reset.html`),
asked to add a copy button next to the 6-digit code.

**Decision:** rejected. HTML email clients (Gmail, Outlook, Apple Mail, etc.) strip `<script>` tags and
inline JS event handlers from email bodies, so a real "click to copy" control cannot run any JavaScript
inside an email - it would render but do nothing in every real inbox.

**What ships instead:** the code stays large and letter-spaced for easy manual selection, and the
"בחירת סיסמה חדשה" button/reset link is the working one-tap alternative for people who don't want to
type the code by hand.

---

## 27/09/2026 — Ship the reset-code flow without brute-force lockout for now

**Context:** `/commit`'s review pipeline (code-reviewer + code-reviewer-ultra) confirmed the reset-code
verification (`isResetCodeValid` in `src/lib/auth/verify-reset-code.ts`) has no attempt counter or
lockout - a known email lets an attacker brute-force the 6-digit code, and since a correct code isn't
consumed until the final password-set step, the window is effectively unbounded (re-requesting a code
never rate-limited either).

**Decision:** ship as-is; fix before onboarding a second real user. Matches the earlier session call
("since I'm the only user, the password reset ownership verification isn't critical now" -
[[decisions/git-and-deploy]] context) - there is no second account for an attacker to target yet, so
real-world exploitability is effectively zero today.

**Follow-up:** `TODO before a second real user exists` comment left on `isResetCodeValid` describing the
fix (persisted `resetCodeAttempts` counter shared by both call sites, lockout after ~5 failures, rate-limit
`forgotPasswordRequest` re-issuance).
