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
for an existing purpose-made component first. All existing call sites were migrated (follow-up
round, 18/09/2026) onto `PrimaryButton`, `SecondaryButton`, `DestructiveButton`, `TextButton`,
`IconButton`, `SurfaceButton`, `ChipButton`, `LinkButton` and `ToggleTextButton` - a bare `Button`
import outside `shared/buttons/` is a regression. See `CORE_RULES.md`, `src/components/shared/SHARED_COMPONENTS.md`, and `GOTCHAS.md` for the
full rule text.

---

## 19/09/2026 — Expiry picker is the shadcn Calendar with month/year dropdowns

**Problem:** the expiry calendar only had month arrows, so picking a date years ahead took dozens of
clicks that one misclick could reset.

**Decision:** use the shadcn Calendar's dropdown caption layout (month and year selects) with the
Hebrew locale (Sunday-first) and RTL direction, a year range from the current year to +20, and past
dates disabled (today allowed). One shared `ExpiryCalendar` serves the add-item form and the
receipt-row editor; the unstyled dropdown parts are styled via `classNames` from that wrapper
because `ui/calendar.tsx` is read-only.

**Why over alternatives:** a native `<input type="date">` (segmented dd/mm/yyyy) was built and
dropped, since the user pointed to the shadcn calendar-with-dropdowns pattern; plain month arrows
were the original problem.

**How to apply:** date fields reuse `ExpiryCalendar`; an initial search that misses a shadcn
option (here `captionLayout`) should check the component's props and docs, not only the registry.
