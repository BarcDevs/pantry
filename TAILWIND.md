# Tailwind Usage Guide

This project uses **Tailwind v4's CSS-only configuration** - there is no `tailwind.config.ts`/`.js` file. All theme setup lives in `src/app/globals.css`.

## How v4 CSS-config works here

Three layers in `globals.css`:

1. **`:root` raw variables** - plain CSS custom properties holding the actual values (hex colors, px sizes, shadow strings). These are *not* Tailwind tokens yet, just named values.
2. **`@theme inline { ... }`** - maps each raw variable into Tailwind's theme namespaces (`--color-*`, `--radius-*`, `--shadow-*`, `--text-*`, `--font-*`). Anything declared in this block automatically becomes a usable utility class. For example `--color-canvas: var(--canvas)` produces `bg-canvas`, `text-canvas`, `border-canvas`, etc. `--text-display: var(--text-display)` produces the `text-display` utility (this is how custom font sizes work in v4 - the `--text-*` namespace is the same one that normally holds `sm`/`md`/`lg`, so defining our own names there overrides/extends the default scale).
3. **`@layer base`** - element defaults (RTL `<html>`, box-sizing, scrollbar, body background/color/font).

## Available tokens

| Token | CSS var | Utility class examples | Value |
|---|---|---|---|
| Canvas | `--canvas` | `bg-canvas` | `#fffaf0` |
| Surface | `--surface` | `bg-surface` | `#ffffff` |
| Ink | `--ink` | `text-ink` | `#2c2a26` |
| Ink 2 | `--ink-2` | `text-ink-2` | `#6f6a5e` (labels) |
| Ink 3 | `--ink-3` | `text-ink-3` | `#8a8578` (secondary text) |
| Ink 4 | `--ink-4` | `text-ink-4` | `#a39d8c` (muted/disabled) |
| Ink green | `--ink-green` | `text-ink-green` | `#76836f` (suggestion-panel reasons) |
| Border | `--border` | `border-border` | `#e2ddd0` (inputs/dividers) |
| Border 2 | `--border-2` | `border-border-2` | `#efe8d9` (card borders) |
| Border 3 | `--border-3` | `border-border-3` | `#f0eadc` (hairline dividers) |
| Track | `--track` | `bg-track` | `#d8d2c4` (toggle-off, scrollbar) |
| Green | `--green` | `bg-green` | `#3f7d4e` (primary) |
| Green deep | `--green-deep`, `--green-deep-2` | `bg-green-deep` | `#2f5f3b`, `#284f33` (gradient stops) |
| Saffron | `--saffron` | `text-saffron` | `#f4c98a` (accent) |
| Status green | `--status-green-bg/fg` | `bg-status-green-bg text-status-green-fg` | `#e7f1e9` / `#3f7d4e` (>7 days) |
| Status amber | `--status-amber-bg/fg` | `bg-status-amber-bg text-status-amber-fg` | `#fbeedd` / `#bd6f1f` (3-7 days) |
| Status red | `--status-red-bg/fg` | `bg-status-red-bg text-status-red-fg` | `#fbe9e5` / `#c4452f` (<3 days/expired) |
| Warning panel | `--warning-bg/border/fg` | `bg-warning-bg border-warning-border text-warning-fg` | out-of-stock/removal flags |
| Radius sm | `--radius-sm` | `rounded-sm` | `8px` (checkboxes, small chips) |
| Radius md | `--radius-md` | `rounded-md` | `13px` (inputs, primary buttons) |
| Radius lg | `--radius-lg` | `rounded-lg` | `18px` (cards, list rows) |
| Shadow card | `--shadow-card` | `shadow-card` | `0 3px 10px -8px rgba(0,0,0,.2)` |
| Shadow button | `--shadow-button` | `shadow-button` | `0 8px 18px -8px rgba(63,125,78,.8)` (green CTAs) |
| Shadow sheet | `--shadow-sheet` | `shadow-sheet` | `0 12px 28px -10px rgba(0,0,0,.5)` (modals/toasts) |
| Display | `--text-display` | `text-display font-display font-extrabold` | `32px`, Assistant 800 |
| Title | `--text-title` | `text-title font-display font-extrabold` | `27px`, Assistant 800 |
| Heading | `--text-heading` | `text-heading font-display font-bold` | `17px`, Assistant 700 |
| Body | `--text-body` | `text-body font-body` | `15px`, Heebo |
| Label | `--text-label` | `text-label font-body font-semibold` | `13px`, Heebo 600 |
| Caption | `--text-caption` | `text-caption font-body` | `12px`, Heebo |
| Display font | `--font-display` | `font-display` | Assistant |
| Body font | `--font-body` | `font-body` | Heebo |

### shadcn/ui bridge

shadcn/ui components expect a fixed set of CSS vars (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--input`, `--ring`, `--radius`). Rather than letting shadcn's `init` populate these with its own oklch palette, they are remapped onto our tokens in `:root` (e.g. `--primary: var(--green)`, `--background: var(--canvas)`, `--destructive: var(--status-red-fg)`, `--radius: var(--radius-md)`) and mirrored into `@theme inline` as `--color-*`. This keeps shadcn components visually consistent with the rest of the app without a second parallel color system. No dark mode is configured - this app has one light theme; the one dark surface (Cooking Mode) is hand-styled per-component, not a global `.dark` variant.

When adding a new shadcn component, if it references a CSS var not yet in this bridge list, add the var to `:root` (mapped to the closest existing token) and to `@theme inline`, then add a row to the table above - do not let shadcn's CLI silently inject an unmapped oklch value.

## Adding a new token

1. Add the raw value to `:root` in `globals.css`.
2. Map it in the `@theme inline` block (`--color-x: var(--x)`, `--text-x: var(--x)`, etc. depending on namespace).
3. Add a row to the table above.

## Rules

- No hardcoded hex colors or px values in component code - use a token utility class.
- No default Tailwind grays (`gray-100`, `slate-500`, etc.) - use the named neutrals above.
- No default Tailwind type-scale classes (`text-sm`, `text-base`, `text-lg`, `text-xl`, etc.) - use the named scale above (`text-display`/`text-title`/`text-heading`/`text-body`/`text-label`/`text-caption`).
- RTL is the default (`<html dir="rtl">` in `src/app/layout.tsx`) - only opt specific elements (email/password/numeric inputs) into `dir="ltr"`.
