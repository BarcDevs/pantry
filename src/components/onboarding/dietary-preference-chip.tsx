import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { onboardingTexts } from '@/constants/texts/onboarding'

export type DietaryOptionKey = keyof typeof onboardingTexts.dietaryOptions

type DietaryPreferenceChipProps = {
    optionKey: DietaryOptionKey
    isSelected: boolean
    onToggle: () => void
}

export const DietaryPreferenceChip = ({
    optionKey,
    isSelected,
    onToggle
}: DietaryPreferenceChipProps) => {
    const { emoji, label } = onboardingTexts.dietaryOptions[optionKey]

    return (
        <Button
            variant={'ghost'}
            onClick={onToggle}
            className={cn(
                'h-auto gap-2 rounded-full border px-4 py-2.75 text-label font-weight-label',
                isSelected
                    ? 'border-green bg-green/10 text-ink-green'
                    : 'border-border text-ink-2'
            )}
        >
            <span className={'text-heading'}>
                {emoji}
            </span>
            {label}
        </Button>
    )
}
