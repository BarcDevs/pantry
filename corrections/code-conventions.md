# Corrections — Code Conventions

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic — not routinely.

---

## 11/07/2026 — `.model.ts` suffix is an Angular-ism (scope:global)

**What was wrong:** files were being named `@/models/user.model.ts`-style.

**Correct fact:** the `.model.ts` suffix convention is an Angular-ism and doesn't belong in this
(or any) React/Next.js codebase — model files are named plainly (e.g. `user.ts`), not
`user.model.ts`.

**Lesson:** applies to any project in this tree using the standard naming conventions, not just
pantry. User caught it directly: "we are not using angular."

---

## 24/07/2026 — Schemas live at `src/schemas/`, not `src/lib/schemas/`

**What was wrong:** ambiguity mid-session over `lib/schemas` vs `src/schemas` ("wait, why
lib/schemas and not just src/scemas?").

**Correct fact:** Zod/validation schemas live at `src/schemas/`, not nested under `src/lib/`.

**Lesson:** matches the broader "Modularity" centralization rule already in `CLAUDE.md`
(constants → `src/constants/`, types → `src/types/`, schemas → `src/schemas/`) — this session is
where that specific path got nailed down for pantry.

---

## 19/09/2026 — Break long lines: conditions and one-line arrow bodies

**What was wrong:** a ~90-character condition was written as a single line:
`if (result.suggestedType && (shouldOverwrite || !type)) setType(result.suggestedType)`. User: "why
a one liner long `if`?"

**Correct fact:** `CORE_RULES.md` targets 40-50 character code lines and says to break long or
complex conditions and ternaries across lines. The "short conditional blocks - never use `{`" rule
only covers genuinely short conditionals. A long condition is written one operand per line with the
`&&` / `||` leading, and may still omit the braces when the body is one short statement.

The same applied to a second line the user flagged: `const requestSuggestion = () => request(name, { onSuggested: (result) => applySuggestedType(result) })`. Object-argument calls and arrow bodies are
broken one property per line.

A third flag on the same code: a one-statement body kept its braces after the condition was broken
across lines (`) {\n    form.setValue(...)\n}`). One-statement bodies never use `{ }`, even when
the condition itself spans several lines - write `) form.setValue(...)`.

**Lesson:** before finishing a change, scan every line you added (`if`, ternary, arrow bodies,
JSX handler props) for anything past about 50 characters and break it. Lint does not catch this, so
it is easy to leave behind. Also scan code a subagent wrote for you.

---

## 19/09/2026 — Centralize logic repeated across hooks first; hook returns stay one object

**What was wrong:** the same suggestion request / refresh / error handling was copy-pasted across
the add-item, edit-item and receipt-row hooks, and a fourth copy of the cache-bypass logic was
about to be wired into each. Separately, the add-item form destructured a hook return into 20
individual names. User: "3 hooks? should be centralised", and "should be centralised to x.y
instead of destructuring all".

**Correct fact:** shared behavior lives in one hook (here `useStorageSuggestion`) and each caller
only supplies what to do with the result. A hook that returns 5+ values is kept as one
feature-named object (`const addItem = useAddItemForm()`, then `addItem.field`); this is now a rule
in `CORE_RULES.md`, copied into the other frontend projects' rule files and the `.sources` template.

**Lesson:** when a feature is about to be added to the second copy of the same logic, stop and
centralize first (as its own `rfc` commit) instead of duplicating it again. The existing 5+ value
destructures were converted in a separate `rfc(hooks)` commit.
