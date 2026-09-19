# Decisions — index

Architecture/technical decisions made during pantry sessions. See `~/Claude/work/projects/RULES.md`
for the full pattern this file follows.

⚠️ **Load on demand.** This is the session-start read — one line per entry, grouped by topic.
Open a topic file only when following a link here for a specific entry, or when the current task
matches that topic.

## Data Modeling — [[decisions/data-modeling]]
Mongoose doc-type shape and how schema types relate to serialized client-facing types.

| Date | Entry |
|---|---|
| 11/07/2026 | Introduced shared `MongoDbObject` base type (`_id`) for all Mongoose doc types |

## AI Features — [[decisions/ai-features]]
Configuration and design choices for the Gemini-backed AI suggestion/recipe features.

| Date | Entry |
|---|---|
| 25/07/2026 | Gemini model id made configurable via env var, with a default in `src/config/env.ts` |
| 11/09/2026 | Ingredient-substitution UI reuses existing status colors (red/amber/green) instead of a new palette |
| 19/09/2026 | Add Item storage defaults to pantry and applies the AI suggestion automatically (never over a manual choice) |
| 19/09/2026 | Suggestion refresh bypasses the 24h cache and replaces the type; one shared `useStorageSuggestion` hook |

## UI Components — [[decisions/ui-components]]
Reusable component conventions (buttons, wrappers) surfaced during pantry sessions.

| Date | Entry |
|---|---|
| 13/09/2026 | `Button` is a base-only wrapper; every call site uses a purpose-made button (e.g. `TextButton`) instead |
| 19/09/2026 | Expiry picker = shadcn Calendar with month/year dropdowns, Hebrew RTL, no past dates |

## Git & Deploy — [[decisions/git-and-deploy]]
Branching and deployment workflow.

| Date | Entry |
|---|---|
| 18/09/2026 | `main` is the trunk; no `dev` branch until the app is published |

## Tooling & Skills — [[decisions/tooling-and-skills]]
Decisions about shared Claude Code skills/workflow surfaced during pantry sessions.

| Date | Entry |
|---|---|
| 24/07/2026 | `/commit` skill: scan all files across a multi-commit change set before splitting into chunks |
| 11/09/2026 | Added `.claude/skills/match-design/` to force a read-first, diff-after loop against `.dc.html` design files |
| 19/09/2026 | PRD is updated in the same change as every feature/tweak (rule in `CLAUDE.md`) |
