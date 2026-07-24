import type { SelectOption } from '@/types/shared'

export const toSelectOptions = <T extends string>(
    values: readonly T[],
    labels: Record<T, string>
): SelectOption<T>[] => values.map((value) => ({
    value,
    label: labels[value]
}))
