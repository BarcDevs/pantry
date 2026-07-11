import type { Difficulty } from '@/types/enums'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { onboardingTexts } from '@/constants/texts/onboarding'

type CookingLevelOptionProps = {
    level: Difficulty
    isSelected: boolean
    onSelect: () => void
}

export const CookingLevelOption = ({
    level,
    isSelected,
    onSelect
}: CookingLevelOptionProps) => {
    const {
        emoji,
        title,
        desc
    } = onboardingTexts.cookingLevels[level]

    return (
        <Button
            variant={'ghost'}
            aria-pressed={isSelected}
            onClick={onSelect}
            className={cn(
                'h-auto w-full justify-start gap-3.5 rounded-lg border-2 px-4 py-4 text-start',
                isSelected ? 'border-green bg-green/10' : 'border-border bg-surface'
            )}
        >
            <span className={'flex size-11.5 shrink-0 items-center justify-center rounded-md bg-border-3 text-heading'}>
                {emoji}
            </span>
            <span className={'flex-1 text-start'}>
                <span className={'block font-display text-heading font-weight-heading text-ink'}>
                    {title}
                </span>
                <span className={'mt-0.5 block text-label font-weight-body text-ink-3'}>
                    {desc}
                </span>
            </span>
            <span
                className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-label text-surface',
                    isSelected ? 'border-green bg-green' : 'border-border-2 bg-surface'
                )}
            >
                {isSelected && '✓'}
            </span>
        </Button>
    )
}
