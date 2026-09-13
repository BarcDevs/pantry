import type { SelectableOptionProps } from '@/types/shared'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

const cardClass = 'h-auto w-full justify-start gap-3.5 rounded-lg border-2 px-4 py-4 text-start'
const chipClass = 'h-auto gap-2 rounded-full border px-4 py-2.75 text-label font-weight-label shadow-chip'

const CardContent = ({
    emoji,
    label,
    description,
    isSelected
}: Omit<SelectableOptionProps, 'variant' | 'onSelect'>) => (
    <>
        <span className={'flex size-11.5 shrink-0 items-center justify-center rounded-md bg-border-3 text-heading'}>
            {emoji}
        </span>
        <span className={'flex-1 text-start'}>
            <span className={'block font-display text-heading font-weight-heading text-ink'}>
                {label}
            </span>
            {description && (
                <span className={'mt-0.5 block text-label font-weight-body text-ink-3'}>
                    {description}
                </span>
            )}
        </span>
        <span
            className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-label text-surface',
                isSelected ? 'border-green bg-green' : 'border-border-2 bg-surface'
            )}
        >
            {isSelected && '✓'}
        </span>
    </>
)

const ChipContent = ({ emoji, label }: Pick<SelectableOptionProps, 'emoji' | 'label'>) => (
    <>
        <span className={'text-heading'}>
            {emoji}
        </span>
        {label}
    </>
)

export const SelectableOption = ({
    variant,
    emoji,
    label,
    description,
    isSelected,
    onSelect
}: SelectableOptionProps) => (
    <Button
        variant={'ghost'}
        aria-pressed={isSelected}
        onClick={onSelect}
        className={cn(
            variant === 'card' ? cardClass : chipClass,
            variant === 'card'
                ? (isSelected ? 'border-green bg-green/10' : 'border-border bg-surface')
                : (isSelected ? 'border-green bg-green/10 text-ink-green' : 'border-border text-ink-2')
        )}
    >
        {variant === 'card' ? (
            <CardContent
                emoji={emoji}
                label={label}
                description={description}
                isSelected={isSelected}
            />
        ) : (
            <ChipContent
                emoji={emoji}
                label={label}
            />
        )}
    </Button>
)
