# Decisions — AI Features

⚠️ Load only when following a link from [[decisions/index]] for a specific entry, or scanning for
a lesson in this topic — not routinely.

---

## 25/07/2026 — Gemini model id configurable via env, with a config default

**Problem:** the Gemini model id was hardcoded in the AI-suggestion code path.

**Decision, after two rounds of correction:** the model must be configurable via env var, with a
fallback *default value* coming from `src/config/env.ts` (not a bare hardcode, and not "only env,
no default"). First attempt over-corrected to env-only with no default ("Now it is not being
defaulted at all"); user pushed back — the config module should still supply the default when the
env var is unset, matching the existing pattern for all other config values in the app.

**Why over alternatives:** matches the existing config pattern used for every other tunable in the
app instead of introducing a one-off exception for this value.

**How to apply:** any model id (or similar tunable) goes through `src/config/env.ts` with a sane
default there, read via `config`, never a literal string inline in the calling code.

---

## 11/09/2026 — Ingredient-substitution UI reuses existing status colors

**Problem:** an AI-suggested ingredient substitution UI needed a color scheme to show
availability/substitutability at a glance; a "new blue" was tried first, then rejected mid-review.

**Decision:** reuse colors already in the existing palette instead of introducing a new one — red
for "missing, no substitute," amber for "missing, but replaceable," green for "available."

**Why over alternatives:** keeps the substitution UI consistent with the existing status-color
vocabulary already used elsewhere in the app (e.g. expiry-status tokens) instead of growing a
second, parallel color language for a similar kind of state.

**How to apply:** any new availability/status UI reuses the existing red/amber/green vocabulary
before considering a new token.

Note: this decision followed real breakage during dev — user reported that a swapped ingredient
(green pepper) still wasn't surfacing an optional red-pepper substitute; the substitution-detection
logic itself needed a real fix (not just the color mapping) before the new color scheme had
anything correct to render.
