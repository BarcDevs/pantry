# Adding a Page/Route

App Router page under the authenticated app shell (`src/app/(app)/`) or a public route
(`src/app/sign-in/`, `src/app/onboarding/`, etc).

## Files
- `src/app/(app)/<route>/page.tsx` — the route (public routes live directly under `src/app/<route>/page.tsx`)
- `src/app/(app)/<route>/loading.tsx` — shadcn `<Skeleton/>`-based loading state (see `pantry/loading.tsx`)
- `src/components/<domain>/<Feature>.tsx` — the actual UI, imported into the page — pages stay thin
- `src/constants/routes.ts` — add the path constant here, never hardcode the URL string
- `src/constants/texts/<domain>.ts` — add any user-facing copy here, never inline strings in components

## Constraints
- Pages are server components by default — only add `'use client'` on the leaf component that needs it
  (form state, browser APIs), not the page itself.
- Page component composes existing `src/components/<domain>/` pieces + `PageHeader` — no business logic in the page.
- Navigate via `<Link href={routes.xxx}>` from `src/constants/routes.ts` — never a raw string, never `router.push`
  for a plain link (only for post-submit/conditional redirects).
- Auth-gated pages rely on the `(app)` layout's session check — don't re-check auth per-page.
- Keep the component ~40 lines per `src/components/CLAUDE.md` — extract sections into their own files.

## References
- `src/app/(app)/pantry/page.tsx` + `src/app/(app)/pantry/loading.tsx`
- `src/app/(app)/add/page.tsx` — composes `AddItemForm` + `AddMethodLinks` + `PageHeader`
- `src/app/(app)/recipes/[id]/page.tsx` — dynamic route param
