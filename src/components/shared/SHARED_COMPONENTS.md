# Shared Components

Reusable wrappers in `src/components/shared/`. Check here before creating new UI - after shadcn/ui itself, this is the next place to look (see `CORE_RULES.md`).

## `buttons/`

Purpose-made buttons live in `src/components/shared/buttons/`. Never import `@/components/ui/button` directly, and
never a raw `<button>`.

### `Button`

Base wrapper around `@/components/ui/button`, adding `cursor-pointer active:scale-[.985]` and (on the `default`
variant only) `shadow-button`. **Base only - never import/use this directly at a call site.** Every purpose-made
button below wraps it; if none of them fit a new shape, add a new purpose-made button here that wraps `Button`,
rather than using `Button` directly or overriding it inline.

```tsx
// inside a purpose-made button, e.g. TextButton.tsx
<Button variant={'ghost'} className={cn('h-auto w-fit p-0 font-bold', className)} {...props}/>
```

### `TextButton`

Colored, no-padding text-style action (e.g. a "select all" / "clear" / "edit" link inline with other content).
Wraps `Button` with `variant={'ghost'} h-auto w-fit p-0 font-bold` plus a `tone` prop (`'green' | 'red' | 'muted' |
'surface' | 'ink'`) for the text color - pass a `className` to adjust text size/layout, not to redo the base shape.

```tsx
<TextButton tone={'red'} onClick={onClearAll}>{label}</TextButton>
```

If a new recurring button shape shows up (checked against existing usages, not assumed), add another purpose-made
button here instead of a one-off inline `className` override at the call site.

## `EmptyState`

Centered icon + message for empty lists/collections. `message` accepts a string or a custom `ReactNode`.

```tsx
<EmptyState
    icon={<PackageIcon size={32}/>}
    message={pantryTexts.emptyTitle}
/>
```

## `EmptyStateCard`

Full-width empty-collection card with icon, title, subtitle and a CTA link button. Distinct from `EmptyState` (which has no CTA and is used for smaller inline empty lists).

```tsx
<EmptyStateCard
    icon={'🧺'}
    title={pantryTexts.emptyTitle}
    subtitle={pantryTexts.emptySub}
    ctaHref={routes.add}
    ctaLabel={pantryTexts.addItem}
/>
```

## `ConfirmationDialog`

Destructive-action confirmation modal (delete, remove, etc.) built on shadcn `Dialog`. `onConfirmAction` is awaited before the dialog closes, so pass an async action; `isLoading` disables the confirm button while it runs.

```tsx
<ConfirmationDialog
    open={open}
    onOpenChangeAction={setOpen}
    title={'Delete item?'}
    description={'This cannot be undone.'}
    label={'Delete'}
    cancelLabel={'Cancel'}
    onConfirmAction={handleDelete}
/>
```

## `form/` - React Hook Form field components

All form fields are RHF-based: they take `control`/`name` (not `value`/`onChange`) and wire into `FormField`/`FormItem`/`FormMessage` from `@/components/ui/form` for built-in label association and validation-error display. Build the form with `useForm` (+ `zodResolver`) and pass `form.control` down - see `useAddItemForm`/`AddItemFields` for the reference pattern.

### `form/FormInputField`

Label + validation message wrapper around any input-like control. Takes a `render(field)` prop so it works with plain `Input`, custom widgets, etc. - spread `field` (`value`/`onChange`/`onBlur`/`ref`/`name`) onto the rendered control.

```tsx
<FormInputField
    control={form.control}
    name={'name'}
    label={pantryTexts.addForm.nameLabel}
    render={(field) => (
        <Input {...field} placeholder={pantryTexts.addForm.namePlaceholder}/>
    )}
/>
```

### `form/FormSelectField`

Label + shadcn `Select`, RHF-wired via `control`/`name`. Generic over the option value type so options stay typed.

```tsx
const storageOptions = STORAGE_LOCATIONS.map((location) => ({
    value: location,
    label: pantryTexts.storageLabels[location]
}))

<FormSelectField
    control={form.control}
    name={'storage'}
    label={pantryTexts.addForm.storageLabel}
    options={storageOptions}
/>
```

### `form/FormError`

Renders a form-level (`errors.root.message`) error string, e.g. for a failed server-action submit surfaced back into RHF via `form.setError('root', { message })`. Renders nothing if there's no root error.

```tsx
<FormError errors={form.formState.errors}/>
```

## When to add a new shared component

Extract here when the same Label+Input/Select-style boilerplate (or similar shadcn composition) shows up in 2+ places, or when a single component's field list would otherwise violate the 5+ grouped-props rule in `CORE_RULES.md` and a generic field renderer removes the duplication instead of just moving it around.

Don't extract prematurely - a one-off `<Input>` with no label (e.g. `pantry-search-input.tsx`'s icon-prefixed search box) is a different UI pattern, not a `FormInputField` candidate.

## Known gotchas

- **`ui/*` components are real, unmodified shadcn CLI output (Radix-based, `style: "new-york"` in `components.json`) - always add new ones via `npx shadcn add <name>`, never hand-write them.** This project ran on a mislabeled `"base-nova"` style backed by `@base-ui/react` for a while, which meant every `shadcn add` silently reverted `ui/*` files to an incompatible primitive set. That's fixed - the whole `ui/` folder is now Radix, so the CLI is safe to use for future additions.
- Polymorphic rendering (button-as-link, etc.) uses Radix's `asChild`, not a `render`/`nativeButton` prop pair: `<Button asChild><Link href={...}>{label}</Link></Button>`.
- **`bg-popover`/`text-popover-foreground` require `--popover`/`--popover-foreground` to be defined in `globals.css`.** They are mapped there (bridge tokens, same pattern as `--background`, `--primary`, etc.) - if a new shadcn primitive references a token that isn't in that bridge list, it silently renders transparent/uncolored instead of erroring.
