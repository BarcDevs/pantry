# Corrections — UI, shadcn & Styling

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic — not routinely.

---

## 04/09/2026 — Never hand-edit `src/components/ui/*` (shadcn) directly

**What was wrong:** a `src/components/ui/*` (shadcn) file was directly hand-edited. User: "i see
you directly editted ui/ comp which is forbidden, shouldve use a shared wrapper around it."

**Correct fact:** `ui/` is machine-generated and read-only; project-specific behavior goes in a
`src/components/shared/` wrapper that is the sole consumer of the primitive.

**Lesson:** this is the real origin of the shadcn-wrapper rule documented in full in `GOTCHAS.md`
("Wrapping shadcn/ui components instead of editing them") — see it for the full recipe and worked
examples (`AppDialog`, `Button`, `LtrInput`, `Toggle`). This same mistake recurred at least once
more later in the project ("why did you manually touched ui/* file?????") — treat any edit inside
`src/components/ui/` as a hard stop, not just a style nit.

---

## 05/09/2026 — Extend `tailwind-merge` one proven conflict at a time

**What was wrong:** an early fix for the twMerge/custom-token gotcha in `GOTCHAS.md`
preemptively registered *every* custom color token in the theme's `shadow` class group in
`extendTailwindMerge`, not just the one actually in conflict.

**Correct fact:** extend `tailwind-merge` only with the specific token(s) proven to conflict at
the call site that surfaced the bug.

**Lesson:** self-corrected once flagged as overengineered: "should've just added the one token
that's actually conflicting, not preemptively listed every color in the theme." Grow the
extension one proven conflict at a time, not speculatively.

---

## 11/09/2026 — RTL/layout fixes need real computed-style verification

**What was wrong:** a greeting-line RTL/bidi bug (`PantryHeader`) was twice claimed fixed without
being actually fixed. User: "NOPE!!! hard refreshed, restarted dev server, everything. still ltr
so stop avoiding" and later "you claimed fixed without verifying!!!!!!!!! shame on u."

**Correct fact:** root cause (documented in full in `GOTCHAS.md`) was twofold: (1) an earlier
"verification" had injected text via `page.evaluate` instead of rendering the real component,
which can look fixed in a screenshot while the actual render path is untouched; (2) the real bug
was `items-end` on a `flex-col` RTL container resolving to flush-*left*, not flush-right
(Tailwind's `items-end` follows inline-end, which is left in RTL) — fixed with `items-start`.

**Lesson:** never claim an RTL/bidi or layout fix is verified without driving the real component
in a real browser and reading actual `getBoundingClientRect()`/computed styles — a screenshot or
a `page.evaluate` DOM patch is not proof.

---

## 19/09/2026 — Use next/image, not a raw <img>

**What was wrong:** the recipe cover fix (`RecipeCoverImage`) rendered a raw `<img>`. User: "not good. we're on next which has its own enhanced <Image/>".

**Correct fact:** images go through `Image` from `next/image`. Remote URLs that come from users or scraped pages (og:image) use `unoptimized` (no host allow-list needed, and no wildcard `remotePatterns`, which would make the optimizer a proxy for any URL) with `fill`, and `referrerPolicy` still passes through to the element.

**Lesson:** before reaching for a raw DOM element, check whether the framework has a primitive for it. `@next/next/no-img-element` is not enabled in this repo's ESLint config, so lint will not catch it.
