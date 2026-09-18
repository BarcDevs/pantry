# Pantry

Mobile-first PWA for managing pantry/fridge inventory and generating AI-powered recipes from what you have on hand.

**Core loop:** Add items → Generate recipe → Cook → Deduct inventory

Hebrew-language, Israel-market MVP. Single household, personal use.

## Stack

- **Next.js 16** (App Router, TypeScript) - deployed to Vercel
- **MongoDB + Mongoose** - schema-first models
- **Auth.js (NextAuth v5)** - Google OAuth + email/password, JWT sessions
- **Gemini Flash** (Vercel AI SDK) - recipe generation, receipt vision, URL/text parsing
- **Tailwind v4 + shadcn/ui** - CSS-only config
- **PWA** - installable, offline shell via custom service worker

## Getting Started

Copy `.env.local.example` to `.env.local` and fill in all values - the app will not boot without them.

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.local.example`. Required:

- **Auth** - `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **MongoDB** - `MONGODB_URI`
- **Gemini** - `GEMINI_API_KEY`

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint autofix |
| `npm run test` | Jest (unit/component) |
| `npm run test:e2e` | Playwright (e2e) |

## Features (MVP)

- Pantry item management - name, storage location, food type, quantity, unit, expiry
- Expiry tracking with visual warnings
- AI recipe generation from pantry contents (Gemini + Google Search Grounding)
- Recipe import from URL or text paste
- Recipe library - save, rate, favorite, tag
- Cooking mode - step-by-step, mobile-optimized
- Post-cooking inventory deduction
- Receipt scan (camera → Gemini Vision → pantry items)
- Receipt import from URL
- Cooking history per recipe

## Project Structure

```
src/
  actions/        # Server Actions (mutations + queries, one file per action)
  app/            # Next.js App Router - (app)/, (public)/, api/
  components/     # UI components
  config/         # Env validation, app config, AI model config
  lib/            # Shared utilities, AI factory
  models/         # Mongoose models
  types/          # Shared TypeScript types
docs/
  pantry-prd.md       # Full product spec, acceptance criteria, API contracts
  architecture.md     # Architecture decisions, enums, deviations from PRD
```

## Docs

- [`docs/pantry-prd.md`](docs/pantry-prd.md) - full spec, screens, API contracts, data model
- [`docs/architecture.md`](docs/architecture.md) - condensed architecture decisions and enums
