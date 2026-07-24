import { SelectableOption } from '@/components/shared/SelectableOption'

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
        <SelectableOption
            variant={'chip'}
            emoji={emoji}
            label={label}
            isSelected={isSelected}
            onSelect={onToggle}
        />
    )
}
