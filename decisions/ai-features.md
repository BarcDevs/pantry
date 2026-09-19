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

---

## 19/09/2026 — Add Item storage defaults to pantry and takes the AI suggestion automatically

**Problem:** the storage location defaulted to the fridge, so most items needed a manual switch, and
the AI's better suggestion was only offered as a hint.

**Decision:** storage defaults to pantry; when the AI suggestion arrives it is applied to the field
automatically, and the user can still change it. Once the user has picked a location themselves,
later suggestions (e.g. after editing the name) never override it - detected from the form's
`change` events, not from the value.

**Why over alternatives:** defaulting to pantry and silently applying the suggestion removes the
common manual step, while tracking the user's own choice keeps the "no override of explicit input"
rule (AC-1.11).

**How to apply:** any new auto-fill from an AI suggestion must skip fields the user set themselves.
Recorded in the PRD as AC-1.8.

---

## 19/09/2026 — Suggestion refresh bypasses the cache and replaces the type

**Problem:** repeated names were served from a 24-hour server cache, so a poor suggestion could not
be redone, and the panel only offered "retry" after a failure.

**Decision:** every suggestion panel (Add Item, Edit Item, receipt row editor) has a refresh button
that calls `suggestStorage(name, { fresh: true })`, which skips the cache. An explicit refresh also
replaces the product type with the new `suggested_type`; the automatic suggestion still fills the
type only when it is empty. All three screens share one `useStorageSuggestion` hook.

**Why over alternatives:** the refresh is an explicit user request to redo the suggestion, so
overriding the type is expected; not overriding a manually chosen type on refresh was considered
and left as an open follow-up.

**How to apply:** new suggestion surfaces reuse `useStorageSuggestion` and pass `fresh` for a
user-triggered refresh. Recorded in the PRD as AC-1.8.
