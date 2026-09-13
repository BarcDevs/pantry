# Decisions — UI Components

⚠️ Load only when following a link from [[decisions/index]] for a specific entry, or scanning for
a lesson in this topic — not routinely.

---

## 13/09/2026 — `Button` is a base-only wrapper; every call site uses a purpose-made button (scope:frontend)

**Problem:** `src/components/shared/Button.tsx` (now `src/components/shared/buttons/Button.tsx`)
was used directly at every call site, with recurring styling needs (a flat colored text-link
shape: `h-auto w-fit p-0 font-bold` + a color) copy-pasted inline across `PantryTypeRow`,
`SettingsProfileCard`, `PantrySelectSheet`, `PantryTypeFilter`, `ReceiptSourceCard`, and others.
`Button` also force-applied `shadow-button` regardless of `variant`, so every flat/ghost/link-style
usage needed a manual `shadow-none` override or it rendered with an unwanted box-shadow ("ghost
shadow" bug on the receipt review screen and elsewhere) - the classic "shared base component whose
callers all patch around its default styling" anti-pattern.

**Decision:**
1. `Button` is a base only - it must never be imported/used directly at a call site.
2. All buttons go through a purpose-made component under `src/components/shared/buttons/` that
   wraps `Button` (first one: `TextButton`, for the flat colored text-link shape, with a `tone`
   prop for color). If no existing purpose-made button fits a needed shape, add a new one there
   that wraps `Button` - never a one-off inline `className` override at the call site.
3. `Button` itself only applies `shadow-button` when `variant === 'default'` - other variants get
   no shadow, so per-usage `shadow-none` overrides are gone.

**Why over alternatives:** centralizing the styling decision in one wrapped component means a
future style change for a given button "type" is one edit, not N edits across every screen that
used the inline pattern - the exact scattered-override problem that caused the shadow bug.

**How to apply:** when adding or touching UI with a button, check `src/components/shared/buttons/`
for an existing purpose-made component first. Only `TextButton` exists as of this decision -
`outline`/`ghost`/`destructive`/default CTA usages elsewhere in the app still reach for `Button`
directly and are pending the same treatment; migrate one you touch to its own purpose-made button
rather than leaving it bare, but don't treat that backlog as license to add `Button` usages of your
own. See `CORE_RULES.md`, `src/components/shared/SHARED_COMPONENTS.md`, and `GOTCHAS.md` for the
full rule text.
