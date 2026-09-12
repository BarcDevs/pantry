# Schema/Model Change (Mongoose)

Adding or changing a field on a pantry item, recipe, or user document.

## Files
- `src/models/<domain>.model.ts` — the Mongoose schema + model export
- `src/types/<domain>.ts` — the matching TS type/interface (`<Domain>Doc`, plus any nested types like
  `StorageSuggestion`) — keep this in sync with the schema by hand, Mongoose doesn't generate it
- `src/types/enums.ts` — if the field is an enum, add/extend the const array here, not inline in the schema
- Every server action under `src/actions/<domain>/` that creates/updates the doc — their Zod input schemas need the
  matching field added
- `src/models/__tests__/<domain>.model.test.ts` — model-level test if validation logic changed
- `docs/architecture.md` — this doc is the source of truth for the data model; update it when the shape changes
  (per root `CLAUDE.md`: "read this before touching pantry items, recipes, or the AI suggestion flow")

## Constraints
- Model files export via the `mongoose.models.X ?? mongoose.model(...)` guard (see `PantryItemModel`) to survive
  Next.js hot-reload re-registering the model — don't drop this guard.
- Enums (`storage`, `type`, `unit`, `source`, etc.) are always defined once in `src/types/enums.ts` and referenced
  from both the Mongoose `enum:` option and any Zod schema — never redeclare the allowed values in a second place.
- Nested sub-shapes (e.g. `storageSuggestionSchema` inside `pantry-item.model.ts`) use `{ _id: false }` — they're not
  independently queryable sub-documents.
- `timestamps: true` on every top-level schema — don't add manual `createdAt`/`updatedAt` fields.
- Every user-owned collection carries `userId: { type: String, required: true, index: true }` — required for the
  per-user scoping constraint in `02-adding-a-server-action.md`.
- After changing a field, grep every action/hook that constructs or reads the doc shape (`grep -rl '<domain>Model'
  src/actions`) — Mongoose won't type-error you into finding them; TypeScript will only catch it where the field is
  explicitly typed.

## References
- `src/models/pantry-item.model.ts` — enum-backed fields, nested schema, `default: null` for optional relations
- `src/types/pantry-item.ts` + `src/types/enums.ts`
- `src/lib/pantry/storage-suggestion-schema.ts` — the Zod mirror of the Mongoose sub-schema, used at the action layer
