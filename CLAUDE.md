# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context Log (Decisions & Corrections)

Two parallel trees, `decisions/` and `corrections/`, each with `index.md` (topic descriptions +
one-line-per-entry tables) and per-topic files with full entries. **Read both `index.md` files at
the start of every new session** — load-bearing context, same tier as this file. **Write
immediately, same turn as the correction/decision** — don't wait to be asked. Topic files and
`archive/` are loaded on demand only, never routinely.

## Model Selection

- **Haiku**: sub-agents, file lookups, search queries, simple edits (<50 lines), code explanation, formatting fixes, style enforcement
- **Sonnet/Opus**: complex debugging, architecture decisions, multi-file refactors, reasoning-heavy tasks

## Token Efficiency

- Grep/Glob over Bash find/ls/grep. Read with offset+limit when line known.
- Edit over Write. Write only for new files or full rewrites.
- Parallel independent tool calls. Sequential only when output feeds next.
- Sub-agents for >3 searches, large scans, slow multi-call tasks. **Don't sub-agent tasks <100 lines.**
- Don't re-read files in context. Don't read full file to confirm small detail.
- No preamble/postamble. No restating request. No summarizing visible diffs.
- No speculative refactors. No "just in case" error handling.

## Behavior

**Before coding:** State assumptions. Ask when uncertain (95% rule). Surface tradeoffs. Don't implement until 95% confident - ask until there.
**Simplicity:** Minimum code that solves the problem. No extra features, abstractions, flexibility, or impossible-scenario handling. 200 lines that could be 50 → rewrite.
**Surgical:** Touch only what you must. Don't improve adjacent code. Match existing style. Mention unrelated dead code - don't delete it. Remove only imports/vars YOUR changes made unused.
**Learn from mistakes:** Save feedback memory on any correction or confirmed non-obvious choice. User should never repeat the same correction. Check memory before similar work.
**Goal-driven:** Define success criteria before starting. For multi-step tasks, state a plan: `1. [step] → verify: [check]`. Loop until verified.

## Project status

Phase 0 scaffold complete (Next.js 16.2.9, Tailwind v4 CSS-only config, Clerk, Mongoose, Vercel AI SDK, Jest, Playwright). Phases 1-3 (pantry CRUD, recipes, receipts) per `docs/plans/gentle-watching-giraffe.md`.

Commands:
- `npm run dev` - dev server
- `npm run build` - production build
- `npm run typecheck` - `tsc --noEmit`
- `npm run lint` - eslint
- `npm run test` - Jest (unit/component)
- `npm run test:e2e` - Playwright (end-to-end)

Requires `.env.local` (see `.env.local.example`) with Clerk, MongoDB, and Gemini credentials - app will not boot without them (env validated at import of `src/config/env.ts`).

## Product

Pantry is a mobile-first PWA: track pantry/fridge inventory, generate AI recipes from what's on hand, cook, then deduct inventory. Single-household personal-use MVP; multi-household is schema-ready but UI-deferred to Phase 2. Hebrew-language, Israel-market only at MVP, single timezone (Asia/Jerusalem).

- Full spec (acceptance criteria, screens, API contracts, data model, risks): `docs/pantry-prd.md` - read the relevant section before implementing a feature rather than re-deriving requirements.
- Condensed architecture decisions, planned stack, and shared enums: `docs/architecture.md` - read this before touching pantry items, recipes, or the AI suggestion flow.

## Design Files

`.claude/design/` - JSX design files from Claude Design (reference when building UI).

## Modularity

Never scatter the same kind of logic across `src/actions/` (or elsewhere) file by file. Centralize by kind:
- Prompt-builder functions (e.g. `buildPrompt`) → one dedicated dir (e.g. `src/lib/prompts/` or `src/services/prompts/`), one fn per file, actions import from there.
- Validation schemas (Zod, etc) → `src/schemas/`, never inline in actions/routes/components.
- Types → `src/types/` (already a rule, see below).
- Constants → `src/constants/` (already a rule, see below).
- Repeated JSX/markup (2+ near-identical usages) → `src/components/shared/`.

When adding or editing code, check for this scatter pattern and centralize proactively - don't wait for a dedicated cleanup pass. Don't force abstraction on one-off or superficially-similar code.

**Read `workflow/05-wrapping-a-shadcn-component.md` before wrapping or customizing a `src/components/ui/` (shadcn) component.** It documents the reusable-wrapper pattern (build one `src/components/shared/` wrapper as the sole consumer of a `ui/` primitive, drive differences through props). For the worked gotchas behind it (tailwind-merge custom-token dedup, `dark:` variant firing under OS dark mode, RTL bugs), see `GOTCHAS.md`.

For "how do I make change X" recipes (adding a page, a server action, a schema change, a form), see `workflow/`.

## Code Style

Rules in `CORE_RULES.md`. Non-negotiable - follow exactly.

### Quick Checklist

Arrow functions | Single quotes | No semicolons | 4-space indent | Nested content on new lines
JSX props: `prop={'value'}` | Export at bottom | Keep components ~40 lines
Use `api` from `@/api` | Access env via config | Use shadcn/ui components
Avoid prop drilling | Clean imports | Delete unused code
SOLID principles | Industry standards | Type-safe forms

**Never:** `React.*` types | Function declarations | Double quotes | `import.meta.env` outside config
**Never:** Direct fetch/axios | Inline exports | Commented code | `window.location` for navigation
**Never:** Multiple components per file | NEXT_PUBLIC_ prefix | Server directives

IMPORTANT: Next.js 16 renamed `middleware` → `proxy`. dont suggest `middleware` in new code nor in code reviews.

## Git & Commits

**Read `GIT_RULES.md` before committing or when instructed to commit.** Do not skip it.
Full rules there. Key constraint: never invoke `/commit` skill on small fixes, formatting, or docs changes - use plain `git commit` for those.

**Never commit without explicit user instruction** - not even after `/review` finishes, lint passes, and typecheck is clean. Those are quality gates, not permission. Wait for "commit", "/commit", or equivalent.

**Commit type:** does this add user-facing behavior? -> `feat`. Fix a bug? -> `fix`. Restructure existing code without changing behavior (config/constant extraction, type aliasing, centralization)? -> `rfc`, never `feat` or `chore`.

## Style/formatting fixes

For style/formatting violations, run `npm run lint:fix` first and only hand-edit what it doesn't resolve.

## Matching a design file exactly

When implementing UI against a `.dc.html` design in `.claude/design/`, treat it as the literal spec, not a reference to approximate:
- Never invent UX copy - pull every label/hint/placeholder string verbatim from the design HTML (or its JS state object for dynamic strings).
- Never substitute colors/tokens - match the exact token in `design_system.md`, not a token that merely "looks close" (e.g. `border-3` vs `border` are different weights, not interchangeable).
- Conditional visibility/logic must match the design's actual gating condition, not a simplified guess.
- Component fidelity matters, not just data-equivalence - a design toggle switch needs an actual switch, not a chip-picker that happens to control the same boolean.
- Before marking a screen "matches design," diff every visible string, color class, and conditional against the design file/`design_system.md` directly - not memory from having read it once earlier in the session.

## Verifying UI/CSS fixes

Never claim a visual/functional bug is fixed based on reading source or unit-testing a class-merge function alone. Prove it against the real compiled CSS and a real browser: drive the actual component (same-origin, not a `data:`/`file:` snippet) and read `getComputedStyle`/`getBoundingClientRect` off the real DOM node, or get the user's own DevTools computed-style output. Some causes (e.g. a Tailwind dark-mode variant firing under the OS's dark-mode media query) are invisible to code-reading and isolated unit tests. If browser automation is itself blocked, say so and ask for the user's DevTools output rather than asserting the fix worked.

## Layout gotcha: `justify-between` on `min-h-screen`

Don't combine `min-h-screen flex flex-col justify-between` on a container with only a few children (title + content + footer) - it distributes the *entire* viewport height as gaps between them. To pin a footer to the bottom while keeping content compact at the top, wrap the content (not the whole page) in a `flex-1` div and let it default to `justify-start` - the spacer absorbs leftover height. Reserve `justify-between` for cases where children genuinely should spread evenly (e.g. a real multi-item toolbar).

## Browser Verification

Use `playwright-cli` (installed as dev dep) for all browser verification tasks - more token-efficient than chrome extension tools.

```bash
npx playwright-cli open http://localhost:3000
npx playwright-cli snapshot          # see page state
npx playwright-cli click e5          # interact via refs
npx playwright-cli console           # check for errors
npx playwright-cli close
```

**Never start `npm run dev` yourself, and never leave one running.** The user runs their own dev server
persistently. Assume it's already up at `http://localhost:3000` and just navigate to it. If it isn't running,
say so and ask the user to start it - don't launch one in the background. If you ever do start one for any
reason, kill it (and confirm it's dead) before finishing the task - don't leave an orphaned process behind.

Login-gated pages: sign in at `/sign-in` with the test account in `.env.local` (`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`) - read it from there, never hardcode it in tracked files.

Prefer `snapshot` over `screenshot` - returns element refs for interaction, not pixels. Use `console` after interactions to catch JS errors.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions and research (exploring structure, understanding relationships, finding files before implementing), first run graphify when graphify-out/graph.json exists. Python path is in `graphify-out/.graphify_python`. Invoke via Bash tool: `$(<graphify-out/.graphify_python) -m graphify query "<question>"`. Use `path "<A>" "<B>"` for relationships and `explain "<concept>"` for focused concepts. Returns a scoped subgraph, much smaller than GRAPH_REPORT.md or raw grep.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `$(<graphify-out/.graphify_python) -m graphify update .` to keep the graph current (AST-only, no API cost).