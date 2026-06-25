# Architecture Notes

Distilled from `docs/pantry-prd.md`. Read that file for full acceptance criteria, screens, and API contracts — this doc is the condensed "decisions that affect how you write code" version.

## Planned stack

- **Next.js 15 App Router (TypeScript)** — single codebase, UI + API routes, deployed to Vercel.
- **MongoDB + Mongoose** — schema-first models; TypeScript enums must mirror DB enums.
- **Clerk** — auth (Google OAuth + email/password). User sync to MongoDB via Clerk webhooks (`user.created`/`user.updated`) at `/api/users/sync` — must stay idempotent.
- **Gemini Flash (Google AI SDK)** — all recipe generation, receipt vision, and URL/text parsing. Server-side only, never exposed to client. Put AI calls behind a service abstraction layer so the model can be swapped.
- **Tailwind + shadcn/ui** — components are copy-owned, not a runtime dependency.
- **next-pwa** — installable PWA, offline shell.

## Architecture decisions worth knowing before touching related code

- **No `cooking_sessions` table.** Cooking history lives on `recipes.history` (JSONB array of `{entryId, cooked_at, rating}`). Post-cooking inventory deduction is a direct `UPDATE` on `pantry_items` — there is no session record.
- **`recipes.rating`** is never directly user-editable. It's always the computed average of non-null ratings in `recipes.history`. It's only set via the cook → deduct → rate flow (`/api/recipes/:id/cook`) or by editing a history entry (`/api/recipes/:id/history/:entryId`).
- **Storage location vs. food type are orthogonal fields** on `pantry_items` (e.g. "vegetables" can be in fridge or freezer) — don't conflate them into one category field.
- **Storage/expiry AI suggestion is a single call returning all three storage options** (`expiry_by_storage: {fridge, freezer, pantry}`), persisted on the pantry item at creation. Switching the storage dropdown afterward reads from the already-stored map — never triggers a second AI call, except via an explicit on-demand "Suggest" button in Edit mode for pre-existing items with no stored suggestion.
- **No recipe versioning.** Edits overwrite the record in place; no `parent_recipe_id` chain.
- **Recipe cards never use generated/searched images.** AI-generated and text-pasted recipes use an AI-selected `emoji` on a gradient card; only URL-imported recipes use the page's `og:image`, with emoji+gradient as fallback. An optional manual `image_url` field exists only for sources with no automatic image (`ai_generated`, text-paste import) — not for URL imports.
- **Guest mode is localStorage-backed**, no auth required. `/api/users/migrate-guest` transfers local data to the server account on signup; must be idempotent (handles partial failures).
- **Recipe generation count is tracked server-side from day one** to support a future freemium paywall without a later migration.
- Duplicate pantry item detection is exact-match on normalized name (lowercase, trim, strip punctuation) — no fuzzy/embedding matching at MVP.

## Deviations from this PRD (deliberate, see `CLAUDE.md` plan reference)

- **No guest mode.** The PRD's localStorage-backed guest entry (§ "Guest mode") conflicts with the Server Actions + SSR architecture actually built, which assumes an authenticated session end-to-end everywhere. Clerk auth is required from first open; there is no guest entry point, migration endpoint, or localStorage data path anywhere in the codebase.
- **`custom_instructions` field added to recipe generation**, beyond the PRD's `RecipeGenerationRequest`. Free-text field on the Generation Config screen, appended verbatim into the Gemini prompt and persisted into `recipes.ai_prompt_context.custom_instructions` for reproducibility.
- **Server Actions instead of Next.js API Routes** for all app mutations/queries (`src/actions/<domain>/<verb-noun>.ts`, one per file). Only the Clerk webhook (`/api/users/sync`) stays a route handler, since webhooks require a real HTTP endpoint.
- **AI calls go through the Vercel AI SDK** (`ai` + `@ai-sdk/google`) via a factory in `src/lib/ai/factory.ts`, not the raw `@google/generative-ai` SDK — keeps provider swapping to one file.
- **PWA implemented without `next-pwa`.** `next-pwa` is a webpack-only plugin and Next.js 16 defaults to Turbopack, which it doesn't support. Used instead: `public/manifest.json` + a hand-written `public/sw.js` (cache-first shell) registered from a small client component (`src/components/shell/service-worker-register.tsx`). Same installable-PWA outcome, no incompatible dependency.
- **`users` gets `onboarding_completed_at: Date | null`**, not in the PRD's field list, so the app knows not to re-show the skippable 3-step onboarding on later logins.

## Enums (must stay identical between TS and DB)

```ts
type StorageLocation = 'fridge' | 'freezer' | 'pantry'
type FoodType = 'vegetables' | 'fruits' | 'dairy' | 'meat' | 'fish' | 'canned' | 'grains' | 'snacks' | 'beverages' | 'condiments' | 'other'
type Difficulty = 'easy' | 'medium' | 'hard'
type RecipeSource = 'ai_generated' | 'imported_url' | 'manual'
type ItemSource = 'manual' | 'receipt_scan' | 'receipt_url'
type Unit = 'kg' | 'g' | 'L' | 'ml' | 'units'
```

See `docs/pantry-prd.md` for the full `StorageSuggestion` and `RecipeGenerationRequest` interfaces, the complete `pantry_items`/`recipes`/`users` schemas, and the API endpoint table.
