# Context Log

Architecture/technical decisions and corrections from sessions. Newest at bottom. Split into
`context/<subject>.md` when large. See `../../RULES.md` for the pattern this file follows.

## 2026-07-11 | kind:decision | scope:project | tags: mongoose, types, models

Problem: `PantryItemDoc` (and other Mongoose doc types) exposed `id` instead of `_id`, which
doesn't match what a real MongoDB fetch returns — a latent bug waiting to break at the first
real query.

Decision: introduce a shared `MongoDbObject` base type carrying only `_id`, and have every
Mongoose doc type extend it instead of redefining its own id field. Keep `*Doc` types
(`PantryItemDoc`, `UserDoc`) as pure schema-shape types, and add separate serialized types
(`PantryItem`, `User` — with `_id: string`) for what actions actually return to the client.

Why over alternatives: a one-off fix on `PantryItemDoc` alone would leave the same bug latent
in every other model. A single base type fixes the id-vs-_id confusion everywhere at once and
keeps schema types and serialized-return types cleanly separated.

How to apply: any new Mongoose model's doc type extends `MongoDbObject`; never redeclare `id`
or `_id` locally on a doc type.

## 2026-07-11 | kind:correction | scope:global | tags: naming, conventions

User caught `@/models/user.model.ts`-style filenames and called it out directly: "we are not
using angular." The `.model.ts` suffix convention is an Angular-ism and doesn't belong in this
(or any) React/Next.js codebase — model files are named plainly (e.g. `user.ts`), not
`user.model.ts`. Applies to any project in this tree using the standard naming conventions, not
just pantry.

## 2026-07-24 | kind:preference | scope:project | tags: schemas, structure

User questioned `lib/schemas` vs `src/schemas` mid-session ("wait, why lib/schemas and not just
src/scemas?"). Confirmed convention: Zod/validation schemas live at `src/schemas/`, not nested
under `src/lib/`. Matches the broader "Modularity" centralization rule already in `CLAUDE.md`
(constants → `src/constants/`, types → `src/types/`, schemas → `src/schemas/`) — this session is
where that specific path got nailed down for pantry.

## 2026-07-24 | kind:preference | scope:global | tags: tooling, graphify, grep

User asked "why are you using grep instead of graphify?" over what turned out to be a plain
lookup in `CORE_RULES.md`. Resolved preference: graphify is for source-code structure/
relationship queries (it only indexes AST nodes from real code, not markdown). Looking something
up in a rules/convention doc (`CORE_RULES.md`, `GOTCHAS.md`, etc.) is correctly done with plain
grep — don't reach for graphify just because it's the "prefer graphify" default; that default is
scoped to codebase-structure questions, not doc lookups.

## 2026-07-24 | kind:decision | scope:global | tags: commit, tooling, skills

User asked for the `/commit` skill's multi-chunk flow to change: when a change set will produce
multiple commits, scan **all** files that will be committed in one pass first, and only after
that full scan split into the planned chunks — instead of scanning/deciding chunk-by-chunk. Goal
was reducing token/time cost on multi-commit sessions. This is a decision about the shared
`/commit` skill (not pantry-specific code) — logged here for provenance since it surfaced in a
pantry session; the skill's own definition is the actual source of truth if it was updated.

## 2026-07-25 | kind:decision | scope:project | tags: ai, config, env

Problem: the Gemini model id was hardcoded in the AI-suggestion code path.

Decision, after two rounds of correction: the model must be configurable via env var, with a
fallback *default value* coming from `src/config/env.ts` (not a bare hardcode, and not "only env,
no default"). First attempt over-corrected to env-only with no default ("Now it is not being
defaulted at all"); user pushed back — the config module should still supply the default when the
env var is unset, matching the existing pattern for all other config values in the app.

How to apply: any model id (or similar tunable) goes through `src/config/env.ts` with a sane
default there, read via `config`, never a literal string inline in the calling code.

## 2026-09-04 | kind:correction | scope:project | tags: shadcn, ui, components

User caught a direct hand-edit of a `src/components/ui/*` (shadcn) file: "i see you directly
editted ui/ comp which is forbidden, shouldve use a shared wrapper around it." This is the real
origin of the shadcn-wrapper rule documented in full in `GOTCHAS.md` ("Wrapping shadcn/ui
components instead of editing them") — `ui/` is machine-generated and read-only; project-specific
behavior goes in a `src/components/shared/` wrapper that is the sole consumer of the primitive.
See `GOTCHAS.md` for the full recipe and worked examples (`AppDialog`, `Button`, `LtrInput`,
`Toggle`). This same mistake (hand-editing `ui/*` directly) recurred at least once more later in
the project ("why did you manually touched ui/* file?????") — treat any edit inside
`src/components/ui/` as a hard stop, not just a style nit.

## 2026-09-05 | kind:correction | scope:project | tags: tailwind, twmerge, css

Follow-up to the twMerge/custom-token gotcha in `GOTCHAS.md`: an early fix attempt preemptively
registered *every* custom color token in the theme's `shadow` class group in
`extendTailwindMerge`, not just the one actually in conflict. Self-corrected once flagged as
overengineered: "should've just added the one token that's actually conflicting, not
preemptively listed every color in the theme." Rule (already in `GOTCHAS.md`): extend
`tailwind-merge` only with the specific token(s) proven to conflict at the call site that
surfaced the bug — grow it one proven conflict at a time, not speculatively.

## 2026-09-11 | kind:correction | scope:project | tags: rtl, verification, testing

A greeting-line RTL/bidi bug (`PantryHeader`) was twice claimed fixed without being actually
fixed — user response: "NOPE!!! hard refreshed, restarted dev server, everything. still ltr so
stop avoiding" and later "you claimed fixed without verifying!!!!!!!!! shame on u." Root cause
(documented in full in `GOTCHAS.md`) turned out to be twofold: (1) an earlier "verification" had
injected text via `page.evaluate` instead of rendering the real component, which can look fixed
in a screenshot while the actual render path is untouched; (2) the real bug was
`items-end` on a `flex-col` RTL container resolving to flush-*left*, not flush-right (Tailwind's
`items-end` follows inline-end, which is left in RTL) — fixed with `items-start`. Rule: never
claim an RTL/bidi or layout fix is verified without driving the real component in a real browser
and reading actual `getBoundingClientRect()`/computed styles — a screenshot or a `page.evaluate`
DOM patch is not proof.

## 2026-09-11 | kind:decision | scope:project | tags: ai, recipes, substitution

Problem: an AI-suggested ingredient substitution UI needed a color scheme to show
availability/substitutability at a glance; a "new blue" was tried first, then rejected mid-review.

Decision: reuse colors already in the existing palette instead of introducing a new one — red
for "missing, no substitute," amber for "missing, but replaceable," green for "available."

Why over alternatives: keeps the substitution UI consistent with the existing status-color
vocabulary already used elsewhere in the app (e.g. expiry-status tokens) instead of growing a
second, parallel color language for a similar kind of state.

This decision followed real breakage during dev — user reported in caps that a swapped
ingredient (green pepper) still wasn't surfacing an optional red-pepper substitute; the
substitution-detection logic itself needed a real fix (not just the color mapping) before the
new color scheme had anything correct to render.

## 2026-09-11 | kind:decision | scope:project | tags: design-fidelity, skills

Recurring root cause across several UI-matching corrections this project (design copy/colors/
components not matching `.claude/design/*.dc.html` exactly) was building UI from memory or
convention instead of reading the exact design markup first. Decision: added a dedicated
`.claude/skills/match-design/` skill that forces a read-first, diff-after loop every time a
screen is built or audited against a design file — no shortcuts, no approximating a token or
inventing copy. This formalizes the "Matching a design file exactly" section already in
`CLAUDE.md`; invoke `/match-design` when building or auditing any screen against a `.dc.html`
design.
