# Adding a Form

React Hook Form + Zod, submitting through a server action. Pattern used by add-item, edit-item, onboarding,
sign-up/sign-in, forgot-password, generate-recipe.

## Files
- `src/schemas/<feature>-form.ts` — Zod schema (`<feature>FormSchema`) + inferred `<Feature>FormValues` type
- `src/hooks/use-<feature>-form.ts` — owns `useForm`, submit handler, calls the server action, exposes state
  (`form`, `isSubmitting`, any feature-specific state like `duplicate`/`suggestion`)
- `src/components/<domain>/<feature>/<Feature>Form.tsx` — thin component: destructures the hook, renders fields
- `src/components/<domain>/<feature>/<Feature>Fields.tsx` — the actual `<FormField>` markup, split out if the form
  has more than a couple of fields (see `add-item-fields.tsx`)
- `src/constants/texts/<domain>.ts` — every label/placeholder/error string

## Constraints
- Form component itself has **no** `useForm` call — that lives entirely in the `use-<feature>-form.ts` hook so the
  component stays presentational and ~40 lines.
- Build fields with the shared wrappers, never raw shadcn `FormField` boilerplate at the call site: use
  `FormInputField` / `FormSelectField` (`src/components/shared/form/`) — check that directory before writing a new
  field wrapper.
- Errors render via `FormError` (`src/components/shared/form/FormError.tsx`), not ad hoc `<p>` tags.
- Validation lives in the Zod schema (`src/schemas/`), resolved into `useForm` via `zodResolver` — no manual
  `if (!value)` checks duplicating what the schema already enforces.
- Submit handler in the hook calls the server action directly (no fetch/axios) and surfaces thrown errors into
  form-level error state — don't let the action's rejection go unhandled.
- Buttons use the shared `Button` (`src/components/shared/buttons/Button`), never a raw shadcn `Button` import. For a
  colored, no-padding text-style action, use `TextButton` (`src/components/shared/buttons/TextButton`) instead of
  reaching for one-off `className` overrides.

## References
- `src/schemas/add-item-form.ts` + `src/hooks/use-add-item-form.ts` + `src/components/pantry/add/add-item-form.tsx`
  + `src/components/pantry/add/add-item-fields.tsx` — full form split across schema/hook/shell/fields
- `src/hooks/use-onboarding-wizard.ts` — multi-step form variant
- `src/components/shared/form/FormInputField.tsx`, `FormSelectField.tsx`, `FormError.tsx`
