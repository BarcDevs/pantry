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

---

## 19/09/2026 — Typing a name never clears the Add Item suggestion

**Problem:** on Add Item, every name change cleared the suggestion and invalidated the in-flight
request, while the debounced effect (keyed on the trimmed name) did not re-run for a trailing space,
so a suggestion could vanish and never come back.

**Decision:** name changes no longer clear the suggestion or drop an in-flight request; the merge
request is still reset on name change. The debounced, trimmed-name effect requests automatically only
when no suggestion currently exists; an explicit refresh (`fresh: true`) always requests and is the
only thing that replaces an existing suggestion.

**Why over alternatives:** simplest rule that honours "typing never clears a suggestion"; deciding
whether a changed name is a "different product" was left out on purpose.

**How to apply:** Add Item only. Recorded in the PRD as AC-1.8. Edit Item and the receipt row editor
still clear on name change (not covered by this decision).

---

## 19/09/2026 — Web recipe sourcing (allow_ai_generation)

**Status:** decided, NOT implemented. The toggle currently only changes one prompt sentence (see
[[corrections/process-and-verification]]); PRD AC-2.8 already specifies the goal.

**Decision:**
- Default (toggle on): search the web first (Gemini Google Search Grounding). If a matching recipe is
  found, use it; if its serving count differs from the requested meals, do a conversion (scale) of that
  recipe, not a fresh generation. Only when nothing is found, generate one from scratch.
- Toggle off: only web-found recipes, no exception - nothing is ever generated. Nothing found = an
  explicit "no match found" state.
- The origin URL of a web-found recipe is saved in the DB (`sourceUrl`), and its image comes from that
  page through the same safe fetch + og:image extraction as URL import.
- Open: whether a web-found recipe is labelled `imported_url` (with `sourceUrl`) or stays `ai_generated`.

**Why:** "no AI = no AI" - the toggle must change behavior, not wording.

**How to apply:** Gemini may not allow the search tool together with structured output; if so use two
calls (grounded find, then structure/convert). User decision 19/09/2026: skip PRD edits for this work
(AC-2.8 already states the toggle behavior; the serving-conversion rule is recorded here only).

---

## 22/09/2026 — Rejected: a dedicated "generate for this dish, skip search" mode

**Status:** decided against. No code change.

**Considered:** a third mode alongside the toggle, where a requested dish would go straight to AI
generation (the `המנה המבוקשת: <dish>. צור מתכון...` prompt line) instead of going through the
web-first search. Raised because the current prompt line reads like it could skip search entirely,
which conflicts with "search-first, not AI" (see the entry above).

**Why dropped:** extra complexity for no real value - the existing hybrid mode (toggle on: search
first, generate only if nothing found) already covers a dish request either way, so a separate mode
would duplicate that path. The prompt line stays as-is; a dish is just one more input into the
web-first search (see [[../corrections/process-and-verification]] and
`src/lib/prompts/build-recipe-search-query.ts`), not a trigger to bypass it.
