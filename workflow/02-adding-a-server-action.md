# Adding a Server Action

Pantry has no custom REST API routes (only `src/app/api/auth/[...nextauth]/route.ts` for next-auth itself) — all
reads/writes go through Next.js Server Actions in `src/actions/`. This is the "add an endpoint" scenario for this repo.

## Files
- `src/actions/<domain>/<verb>-<noun>.ts` — the action, e.g. `add-pantry-items.ts`, `update-onboarding.ts`
- `src/actions/<domain>/__tests__/<verb>-<noun>.test.ts` — matching unit test, always
- `src/models/<domain>.model.ts` — Mongoose model it reads/writes (see `03-schema-model-change.md` if the shape changes)
- `src/types/<domain>.ts` — input/output types for the action
- `src/hooks/use-<feature>.ts` — client hook that calls the action (form submit, mutation, etc.)

## Constraints
- First line is `'use server'`.
- Validate input with a Zod schema before touching the DB — `<domain>ActionSchema.parse(...)` or `.safeParse(...)`.
  Existing actions inline the schema at the top of the file (see `add-pantry-items.ts`); per project `CLAUDE.md`
  modularity rules, prefer extracting to `src/schemas/` for anything reused or non-trivial — don't perpetuate the
  inline pattern in new actions if the schema is more than a couple of fields.
- Auth first: `const userId = await requireUserId()` from `@/lib/auth/require-user-id` before any DB call.
- `await connectDB()` from `@/lib/mongodb` before any Mongoose call.
- Always scope queries by `userId` — this is a single-tenant-per-user app, never trust a client-supplied owner id.
- Return plain serializable objects — run Mongoose docs through `toPlainDoc<T>()` (`@/lib/mongo-doc`) before
  returning from a server action; a raw doc/ObjectId crossing the server/client boundary will crash or leak methods.
- No error swallowing — let it throw, the calling hook/form surfaces it (see `FormError` / `ErrorDisplay` pattern).
- Name exports as the verb-noun the file is named after (`addPantryItems`, `updateOnboarding`) — no default exports.

## References
- `src/actions/pantry/add-pantry-items.ts` — merge/duplicate-detection example, `toPlainDoc` usage
- `src/actions/pantry/update-pantry-item.ts`
- `src/actions/users/update-onboarding.ts`
- `src/lib/auth/require-user-id.ts`
