# Corrections — Tooling

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic — not routinely.

---

## 24/07/2026 — graphify is for codebase structure, not doc lookups (scope:global)

**What was wrong:** grep was used for a plain lookup in `CORE_RULES.md`; user asked "why are you
using grep instead of graphify?"

**Correct fact:** graphify is for source-code structure/relationship queries (it only indexes AST
nodes from real code, not markdown). Looking something up in a rules/convention doc
(`CORE_RULES.md`, `GOTCHAS.md`, etc.) is correctly done with plain grep.

**Lesson:** don't reach for graphify just because it's the "prefer graphify" default — that
default is scoped to codebase-structure questions, not doc lookups.
