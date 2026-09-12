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
