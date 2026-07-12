# Shared Components

Reusable wrappers in `src/components/shared/`. Check here before creating new UI — after shadcn/ui itself, this is the next place to look (see `CORE_RULES.md`).

## `Button`

Wraps `@/components/ui/button`, adding `cursor-pointer shadow-button active:scale-[.985]`.

Always import this instead of `@/components/ui/button` directly, and never a raw `<button>`.

```tsx
<Button variant={'outline'} onClick={...}>{label}</Button>
```

## `FormInputField`

Label + shadcn `Input`, associated via `htmlFor`/`id`. Accepts every native `Input` prop (`type`, `placeholder`, `required`, `min`, `step`, ...) via `ComponentProps<typeof Input>` — pass them straight through, no need to re-declare them.

```tsx
<FormInputField
    id={'item-name'}
    label={pantryTexts.addForm.nameLabel}
    value={values.name}
    onChange={(e) => handlers.setName(e.target.value)}
    placeholder={pantryTexts.addForm.namePlaceholder}
    required
/>
```

## `FormSelectField`

Label + shadcn `Select`, associated via `htmlFor`/`id`. Generic over the option value type (`<T extends string>`) so callers get a typed `onChange`, not a raw string. Handles the `SelectValue` render-prop internally — **always use this instead of a raw `Select`**, since `Select.Value` does not automatically show the matched item's label (see "Known gotchas" below).

```tsx
const storageOptions = STORAGE_LOCATIONS.map((location) => ({
    value: location,
    label: pantryTexts.storageLabels[location]
}))

<FormSelectField
    id={'item-storage'}
    label={pantryTexts.addForm.storageLabel}
    value={values.storage}
    options={storageOptions}
    onChange={handlers.setStorage}
/>
```

## When to add a new shared component

Extract here when the same Label+Input/Select-style boilerplate (or similar shadcn composition) shows up in 2+ places, or when a single component's field list would otherwise violate the 5+ grouped-props rule in `CORE_RULES.md` and a generic field renderer removes the duplication instead of just moving it around.

Don't extract prematurely — a one-off `<Input>` with no label (e.g. `pantry-search-input.tsx`'s icon-prefixed search box) is a different UI pattern, not a `FormInputField` candidate.

## Known gotchas (apply to any future shared component built on Base UI primitives)

- **`Select.Value` does not inherit the matched `SelectItem`'s children.** It renders the raw value unless given a `children` render-prop: `<SelectValue>{(value) => label}</SelectValue>`. `FormSelectField` already handles this — don't reintroduce a bare `<SelectValue/>` elsewhere.
- **`bg-popover`/`text-popover-foreground` require `--popover`/`--popover-foreground` to be defined in `globals.css`.** They are mapped there (bridge tokens, same pattern as `--background`, `--primary`, etc.) — if a new shadcn primitive references a token that isn't in that bridge list, it silently renders transparent/uncolored instead of erroring.
