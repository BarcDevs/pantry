import type { SelectableOptionProps } from '@/types/shared'

import { ChipButton } from '@/components/shared/buttons/ChipButton'
import { SurfaceButton } from '@/components/shared/buttons/SurfaceButton'

import { cn } from '@/lib/utils'

const cardClass = 'gap-3.5 rounded-lg border-2 px-4 py-4'
const chipClass = 'text-label font-weight-label shadow-chip'

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
    variant === 'card' ? (
        <SurfaceButton
            aria-pressed={isSelected}
            onClick={onSelect}
            className={cn(
                cardClass,
                isSelected ? 'border-green bg-green/10' : 'border-border bg-surface'
            )}
        >
            <CardContent
                emoji={emoji}
                label={label}
                description={description}
                isSelected={isSelected}
            />
        </SurfaceButton>
    ) : (
        <ChipButton
            isSelected={isSelected}
            aria-pressed={isSelected}
            onClick={onSelect}
            className={cn(
                chipClass,
                isSelected ? 'border-green bg-green/10 text-ink-green' : 'border-border text-ink-2'
            )}
        >
            <ChipContent
                emoji={emoji}
                label={label}
            />
        </ChipButton>
    )
)
