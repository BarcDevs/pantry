import type { Difficulty } from '@/types/enums'

import { SelectableOption } from '@/components/shared/SelectableOption'

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
        <SelectableOption
            variant={'card'}
            emoji={emoji}
            label={title}
            description={desc}
            isSelected={isSelected}
            onSelect={onSelect}
        />
    )
}
