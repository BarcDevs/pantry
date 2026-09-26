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
