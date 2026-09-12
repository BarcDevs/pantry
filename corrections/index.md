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
