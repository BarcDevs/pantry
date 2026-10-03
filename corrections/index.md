# Corrections — index

Corrections and confirmed preferences given to Claude during pantry sessions. See
`~/Claude/work/projects/RULES.md` for the full pattern this file follows.

⚠️ **Load on demand.** This is the session-start read — one line per entry, grouped by topic.
Open a topic file only when following a link here for a specific entry, or when the current task
matches that topic.

## Code Conventions — [[corrections/code-conventions]]
Naming and file-organization conventions caught or confirmed mid-session.

| Date | Entry |
|---|---|
| 11/07/2026 | `.model.ts` filename suffix is an Angular-ism — model files named plainly (global) |
| 24/07/2026 | Zod/validation schemas live at `src/schemas/`, not `src/lib/schemas/` |
| 19/09/2026 | Break long lines (conditions, arrow bodies, handler props) and drop braces on one-statement blocks - lint does not catch either |
| 19/09/2026 | Centralize logic repeated across hooks first; hooks returning 5+ values are used as one `obj.field` object |
| 19/09/2026 | Imports break at 2+ named imports or 100+ chars; a review finding is a claim, check it against the rule |

## Tooling — [[corrections/tooling]]
When to use graphify vs. plain search tools.

| Date | Entry |
|---|---|
| 24/07/2026 | graphify is for codebase-structure queries only — use plain grep for rules/convention docs (global) |

## UI, shadcn & Styling — [[corrections/ui-shadcn-and-styling]]
shadcn/ui component boundaries, Tailwind/twMerge conflicts, and RTL/layout verification discipline.

| Date | Entry |
|---|---|
| 04/09/2026 | Never hand-edit `src/components/ui/*` (shadcn) directly — wrap it in `src/components/shared/` |
| 05/09/2026 | Extend `tailwind-merge` only with the specific token proven to conflict, not the whole theme |
| 11/09/2026 | Never claim an RTL/layout fix is verified without checking real computed styles in a real browser |
| 19/09/2026 | Use `next/image` (`unoptimized` for arbitrary remote URLs), never a raw `<img>` |

## AI Models & Cost — [[corrections/ai-models-and-cost]]
Model selection and cost/billing pitfalls when touching AI config.

| Date | Entry |
|---|---|
| 26/09/2026 | Read "search an image by text" as "generate an image" and swapped in a paid, no-free-tier model without asking - confirm feature intent and billing status before touching AI model config |

## Git & Deploy — [[corrections/git-and-deploy]]
Branch, push and merge discipline.

| Date | Entry |
|---|---|
| 19/09/2026 | Never commit directly to `main`, never push unprompted — work on a branch, state it, ask if the request doesn't match reality |
| 19/09/2026 | Commit the feature first, then the refactor as its own commit |
| 26/09/2026 | Every separate piece of work gets its own branch - check `git branch --show-current` first, create one before the first commit |
| 03/10/2026 | Don't reach for a worktree when a plain `git checkout` on a clean tree is enough |

## Process & Verification - [[corrections/process-and-verification]]
Verifying that a plan step or PRD requirement is really implemented before calling it done.

| Date | Entry |
|---|---|
| 19/09/2026 | Web-search toggle only changed prompt wording; a plan step / PRD toggle is done only when the code enforces it |
| 21/09/2026 | A pending question stops the turn; a 'wdym' gets a plain explanation and nothing else (global) |
| 03/10/2026 | Claimed a UI margin fix from a tight screenshot crop without measuring the real gap - get full context + computed style before claiming done (global) |
| 03/10/2026 | Fixed a "no padding" button complaint by adding outer margin instead of the button's own padding - diagnose p-0/no-internal-spacing vs. tight sibling gap first (global) |
