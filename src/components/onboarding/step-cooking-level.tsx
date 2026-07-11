import type { Difficulty } from '@/types/enums'
import { DIFFICULTIES } from '@/types/enums'
import type { SetState } from '@/types/react'

import { CookingLevelOption } from '@/components/onboarding/cooking-level-option'
import { OnboardingStepHeader } from '@/components/onboarding/onboarding-step-header'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepCookingLevelProps = {
    value: Difficulty | undefined
    onChange: SetState<Difficulty | undefined>
}

export const StepCookingLevel = ({
    value,
    onChange
}: StepCookingLevelProps) => (
    <div className={'flex flex-col gap-2'}>
        <OnboardingStepHeader
            title={onboardingTexts.stepCookingLevelTitle}
            subtitle={onboardingTexts.stepCookingLevelSubtitle}
        />
        <div className={'flex flex-col gap-3'}>
            {DIFFICULTIES.map((level) => (
                <CookingLevelOption
                    key={level}
                    level={level}
                    isSelected={value === level}
                    onSelect={() => onChange(level)}
                />
            ))}
        </div>
    </div>
)
