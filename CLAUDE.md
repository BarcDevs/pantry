# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Before coding:** State assumptions. Ask when uncertain (95% rule). Surface tradeoffs. Don't implement until 95% confident — ask until there.
**Simplicity:** Minimum code that solves the problem. No extra features, abstractions, flexibility, or impossible-scenario handling. 200 lines that could be 50 → rewrite.
**Surgical:** Touch only what you must. Don't improve adjacent code. Match existing style. Mention unrelated dead code — don't delete it. Remove only imports/vars YOUR changes made unused.
**Learn from mistakes:** Save feedback memory on any correction or confirmed non-obvious choice. User should never repeat the same correction. Check memory before similar work.
**Goal-driven:** Define success criteria before starting. For multi-step tasks, state a plan: `1. [step] → verify: [check]`. Loop until verified.

## Project status

Phase 0 scaffold complete (Next.js 16.2.9, Tailwind v4 CSS-only config, Clerk, Mongoose, Vercel AI SDK, Jest, Playwright). Phases 1-3 (pantry CRUD, recipes, receipts) per `C:\Users\66bar\.claude\plans\gentle-watching-giraffe.md`.

Commands:
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — eslint
- `npm run test` — Jest (unit/component)
- `npm run test:e2e` — Playwright (end-to-end)

Requires `.env.local` (see `.env.local.example`) with Clerk, MongoDB, and Gemini credentials — app will not boot without them (env validated at import of `src/config/env.ts`).

## Product

Pantry is a mobile-first PWA: track pantry/fridge inventory, generate AI recipes from what's on hand, cook, then deduct inventory. Single-household personal-use MVP; multi-household is schema-ready but UI-deferred to Phase 2. Hebrew-language, Israel-market only at MVP, single timezone (Asia/Jerusalem).

- Full spec (acceptance criteria, screens, API contracts, data model, risks): `docs/pantry-prd.md` — read the relevant section before implementing a feature rather than re-deriving requirements.
- Condensed architecture decisions, planned stack, and shared enums: `docs/architecture.md` — read this before touching pantry items, recipes, or the AI suggestion flow.

## Code Style

Rules in `CORE_RULES.md`. Non-negotiable — follow exactly.

### Quick Checklist

Arrow functions | Single quotes | No semicolons | 4-space indent | Nested content on new lines
JSX props: `prop={'value'}` | Export at bottom | Keep components ~40 lines
Use `api` from `@/api` | Access env via config | Use shadcn/ui components
Avoid prop drilling | Clean imports | Delete unused code
SOLID principles | Industry standards | Type-safe forms

**Never:** `React.*` types | Function declarations | Double quotes | `import.meta.env` outside config
**Never:** Direct fetch/axios | Inline exports | Commented code | `window.location` for navigation
**Never:** Multiple components per file | NEXT_PUBLIC_ prefix | Server directives

## Git & Commits

**Read `GIT_RULES.md` before committing or when instructed to commit.** Do not skip it.
Full rules there. Key constraint: never invoke `/commit` skill on small fixes, formatting, or docs changes — use plain `git commit` for those.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).