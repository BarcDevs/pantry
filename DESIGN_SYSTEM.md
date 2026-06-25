# Pantry — Design System

A warm, kitchen-pantry aesthetic for a Hebrew (RTL), mobile-first PWA. Friendly and homey but precise. All UI is `dir="rtl"`.

---

## 1. Foundations

### Typefaces
| Role | Family | Weights | Use |
|---|---|---|---|
| Display / headings | **Assistant** | 500–800 | Logo, screen titles, hero copy, section headers. Usually 800. |
| Body / UI | **Heebo** | 400–800 | Everything else: labels, inputs, body, buttons, captions. |

Load: `Heebo:400,500,600,700,800` + `Assistant:500,600,700,800`.
Numerals & LTR fields (email, password) use `dir="ltr"` + `text-align:left`.

### Type scale (px)
| Token | Size / weight | Use |
|---|---|---|
| display | 30–34 / 800 Assistant | Logo, hero |
| title | 27–28 / 800 Assistant | Screen titles |
| heading | 17 / 700 | Card titles, item names |
| body | 15–16 / 400–600 | Default copy, inputs, buttons |
| label | 13 / 600 | Field labels, filter chips |
| caption | 12–12.5 / 400–700 | Helper text, reasons, meta |

Line-height 1.4–1.55 for paragraphs; `text-wrap: pretty` on long copy.

---

## 2. Color

### Neutrals (warm)
| Token | Hex | Use |
|---|---|---|
| canvas | `#fffaf0` | App background (warm cream) |
| surface | `#ffffff` | Cards, inputs, sheets |
| ink | `#2c2a26` | Primary text |
| ink-2 | `#6f6a5e` | Labels |
| ink-3 | `#8a8578` | Secondary text |
| ink-4 | `#a39d8c` | Muted hints, disabled |
| ink-green | `#76836f` | Reason text inside suggestion panels |
| border | `#e2ddd0` | Input borders, dividers |
| border-2 | `#efe8d9` | Card borders |
| border-3 | `#f0eadc` | Hairline list dividers |
| track | `#d8d2c4` | Toggle-off track, scrollbar |

### Brand
| Token | Hex | Use |
|---|---|---|
| green | `#3f7d4e` | Primary buttons, links, active states, toggles-on |
| green-deep | `#2f5f3b` → `#284f33` | Brand gradient (`linear-gradient(165deg,#3f7d4e,#2f5f3b 60%,#284f33)`) |
| saffron | `#f4c98a` | Warm accent — logo mark detail, loading spinner top |

### Status (expiry / stock) — `[background, foreground]`
| State | Bg | Fg | Meaning |
|---|---|---|---|
| green | `#e7f1e9` | `#3f7d4e` | >7 days |
| amber | `#fbeedd` | `#bd6f1f` | 3–7 days |
| red | `#fbe9e5` | `#c4452f` | <3 days / expired |
| warning panel | `#fdf3ef` bg, `#f3d6cd` border, `#c4452f` text | | "out of stock" / removal flag |

Keep accent chroma low; never introduce new saturated hues outside this set.

---

## 3. Shape, elevation, spacing

| Token | Value |
|---|---|
| radius-sm | 7–9px (checkboxes, small chips, inline buttons) |
| radius-md | 12–15px (inputs, primary buttons, panels) |
| radius-lg | 18px (cards, list rows, setting groups) |
| radius-full | 50% (logo mark, avatars, spinner) |
| card shadow | `0 3px 10px -8px rgba(0,0,0,.2)` |
| button shadow (green) | `0 8px 18px -8px rgba(63,125,78,.8)` |
| toast/sheet shadow | `0 12px 28px -10px rgba(0,0,0,.5)` |

Spacing rhythm: 6 / 10 / 14 / 18 / 24 / 28px. Use flex/grid with `gap`. Inputs pad `14px 15px`; cards pad `15px`; setting groups pad `4px 18px`.

---

## 4. Components

**Primary button** — `background:#3f7d4e; color:#fff; font-weight:700; padding:15px; border-radius:14px;` green shadow. Active: `transform:scale(.985)`.

**Secondary / OAuth button** — `background:#fff; border:1px solid #e2ddd0; color:#2c2a26; font-weight:600; padding:13px; border-radius:14px;` icon + label, `gap:10px`.

**Inline action button** (e.g. "קבע תפוגה") — green fill, `font-size:12.5px; padding:8px 14px; border-radius:9px`.

**Input** — `background:#fff; border:1px solid #e2ddd0; border-radius:13px; padding:14px 15px;` label above at 13/600 `#6f6a5e`. Password/email fields are `dir="ltr"`, left-aligned.

**Checkbox** — 22×22, `border-radius:7px`, off `1.5px #e2ddd0`, on filled green with white ✓.

**Toggle** — pill track 44×24-ish, off `#d8d2c4`, on `#3f7d4e`, white knob inset 3px.

**Filter chip** — pill, selected = green fill/white, idle = `#fff` + `#e2ddd0` border, label 13/600.

**Pantry item card** — white, `border:1px solid #efe8d9; border-radius:18px; padding:15px;` shadow. Layout: emoji (32px) top-start + status chip top-end; name 17/700; meta line 13 `#8a8578` with `✎` edit affordance.

**Status chip** — `background:<status.bg>; color:<status.fg>; border-radius:full; padding:~4px 10px; font-size:12px; font-weight:700`.

**Suggestion panel (smart storage/expiry)** — soft tinted card; **match** state shows confirmation + reason only; **mismatch** shows current vs. recommended reasons side by side + a green "Select/קבע" inline button.

**Recipe card visual** — AI recipes: single emoji centered on a colored gradient. Imported: `og:image`, falling back to emoji+gradient.

**Loading state** — full-bleed brand-gradient panel, 92px ring spinner (`3px` track, `#f4c98a` top), `animation:spin 1s linear`, Assistant title beneath.

**Toast** — centered top, `#2c2a26` bg, white, `border-radius:13px; padding:12px 20px`, deep shadow.

---

## 5. RTL & layout rules
- App root: `dir="rtl"`, default text-align right.
- Mobile-first single column; responsive split (brand panel + form) on auth at wide widths.
- LTR islands: email, password, numeric inputs — set `dir="ltr"` + `text-align:left`.
- Cooking mode is the one **dark** surface: brand-gradient/near-black bg, large step text, minimal chrome, step counter + progress bar.
- Custom scrollbar: 8px, thumb `#d8d2c4`.

---

## 6. Voice
Warm, second-person plural Hebrew ("בשלו ממה שכבר יש לכם בבית"). Sparing, on-brand emoji (🥕 👋 🍝) as friendly punctuation — never decorative filler. Concise helper text; reasons kept ≤5 words.
