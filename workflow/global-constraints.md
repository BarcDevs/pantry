# Global Constraints

## Read before implementing
- `docs/pantry-prd.md` — acceptance criteria, screens, API contracts, data model, risks. Read the relevant section
  before implementing a feature rather than re-deriving requirements.
- `docs/architecture.md` — architecture decisions, planned stack, shared enums. Read before touching pantry items,
  recipes, or the AI suggestion flow.
- `../GOTCHAS.md` — accumulated debugging lessons (shadcn wrapper gotchas, RTL bugs, twMerge token gotcha,
  dark-mode variant bug). Read before touching `src/components/ui/` wrappers or RTL-sensitive layout.

## Centralize by kind — never scatter
- Prompt-builder functions → `src/lib/prompts/` (or `src/services/prompts/`), one fn per file.
- Validation schemas (Zod) → `src/schemas/`, not inline in actions/routes/components.
- Types → `src/types/`.
- Constants → `src/constants/`.
- User-facing copy → `src/constants/texts/<domain>.ts` — never inline strings in components.
- Repeated JSX/markup (2+ near-identical usages) → `src/components/shared/`.
Don't force abstraction on one-off or superficially-similar code.

## UI components — shadcn first
- Always use the shadcn/ui component if one exists (`Button`, `Input`, `Select`, `Badge`, `Card`, etc).
- `src/components/ui/` is read-only — never edit it directly, wrap it (see `05-wrapping-a-shadcn-component.md`).
- Check `src/components/shared/` and `src/components/shared/form/` before creating new UI.
- Loading states always use shadcn `<Skeleton/>` — never a custom loader.

## Data access
- Server actions only — this app has no custom REST routes (see `02-adding-a-server-action.md`). Never add a
  `fetch`/axios call from a client component; call the server action directly.
- Every query/mutation scoped by `userId` from `requireUserId()` — never trust a client-supplied owner id.
- Mongoose docs never cross the server/client boundary raw — always `toPlainDoc<T>()` first.

## Code style
- Arrow functions, single quotes, no semicolons, 4-space indent, nested JSX content on its own line.
- JSX props as `prop={'value'}`. Export at bottom, not inline (except app router pages).
- Components ~40 lines — extract when they grow past that.
- Never: `React.*` types, function declarations, double quotes, direct fetch/axios, `window.location` for nav,
  multiple components per file, `NEXT_PUBLIC_` prefix, server directives.
- Middleware note: Next.js 16 renamed `middleware` → `proxy` — never suggest `middleware` in new code.

## Verifying UI/CSS fixes
- Never claim a visual/functional bug fixed from reading source or unit-testing a class-merge function alone.
  Prove it against real compiled CSS and a real browser (`getComputedStyle`/`getBoundingClientRect` on the real DOM
  node, or the user's DevTools output) — see `../GOTCHAS.md` for cases this rule was written for.

## Design files
- `.claude/design/` holds `.dc.html` files from Claude Design — when implementing against one, treat it as the
  literal spec: verbatim copy, exact tokens, exact conditional logic, real matching components — not an
  approximation from memory.
