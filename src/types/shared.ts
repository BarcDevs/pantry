export type SelectableOptionProps = {
    variant: 'card' | 'chip'
    emoji: string
    label: string
    description?: string
    isSelected: boolean
    onSelect: () => void
}

export type SelectOption<T extends string> = {
    value: T
    label: string
}
