# Decisions — Tooling & Skills

⚠️ Load only when following a link from [[decisions/index]] for a specific entry, or scanning for
a lesson in this topic — not routinely.

---

## 24/07/2026 — `/commit` skill: full scan before chunk split (scope:global)

**Problem:** the `/commit` skill's multi-chunk flow scanned/decided chunk-by-chunk on multi-commit
change sets, costing extra tokens/time.

**Decision:** when a change set will produce multiple commits, scan **all** files that will be
committed in one pass first, and only after that full scan split into the planned chunks.

**Why over alternatives:** a single full-repo scan up front is cheaper than re-scanning
incrementally per chunk.

**How to apply:** this is a decision about the shared `/commit` skill, not pantry-specific code —
logged here for provenance since it surfaced in a pantry session; the skill's own definition is
the actual source of truth if it was updated since.

---

## 11/09/2026 — Added `match-design` skill for design-fidelity

**Problem:** recurring root cause across several UI-matching corrections this project (design
copy/colors/components not matching `.claude/design/*.dc.html` exactly) was building UI from
memory or convention instead of reading the exact design markup first.

**Decision:** added a dedicated `.claude/skills/match-design/` skill that forces a read-first,
diff-after loop every time a screen is built or audited against a design file — no shortcuts, no
approximating a token or inventing copy.

**Why over alternatives:** formalizes the "Matching a design file exactly" section already in
`CLAUDE.md` as an enforced workflow instead of a passive doc section that's easy to skip under
pressure.

**How to apply:** invoke `/match-design` when building or auditing any screen against a `.dc.html`
design.

---

## 19/09/2026 — The PRD is updated in the same change as any feature or tweak

**Problem:** several features and tweaks landed in code without being written into
`docs/pantry-prd.md`, so the PRD drifted from what the app does.

**Decision:** a "Keep the PRD in sync" section in `CLAUDE.md`: any feature or tweak that is not
already described, or that changes described behavior, updates the PRD (acceptance criteria, Screen
Map row, data model or API) in the same change and the same commit, without being asked.

**Why over alternatives:** a separate "update the docs later" pass was the pattern that caused the
drift.

**How to apply:** when finishing a feature, edit the matching AC or add the next AC number in the
same commit.

---

## 27/09/2026 — Design files are synced from Claude Design through the `claude_design` MCP

**Problem:** `.claude/design/` was filled by hand from URL/zip exports, so it went stale and one
file (the reset-password email) was a hand-written approximation: different theme, no dark-mode or
Outlook handling, and different copy. A screen built from it would not have matched the real design.

**Decision:** sync from the Claude Design project (id and re-sync steps in
`.claude/design/SOURCE.md`) using the `claude_design` MCP (`https://api.anthropic.com/v1/design/mcp`,
auth via `/design-login`): `list_files` to diff etags, `read_file` to pull changed files, byte-size
check against the remote before accepting. `/match-design` gained a Step 0.5 that runs this check
before building any screen.

**Why over alternatives:** the zip/URL export had no cheap "what changed" check and no exactness
guarantee; the MCP gives per-file etags and exact content, and a size check catches transcription
errors.

**How to apply:** before implementing a screen, `list_files` and compare etags with `SOURCE.md`;
re-sync any stale file first. `icons/` and `uploads/` are not synced (binary).
