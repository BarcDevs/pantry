import type { Difficulty } from '@/types/enums'
import type { SetState } from '@/types/react'

import { OnboardingStepHeader } from '@/components/onboarding/onboarding-step-header'
import { CookingLevelPicker } from '@/components/shared/CookingLevelPicker'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepCookingLevelProps = {
    value: Difficulty | undefined
    onChange: SetState<Difficulty | undefined>
}

export const StepCookingLevel = ({
    value,
    onChange
}: StepCookingLevelProps) => (
    <CookingLevelPicker
        title={(
            <OnboardingStepHeader
                title={onboardingTexts.stepCookingLevelTitle}
                subtitle={onboardingTexts.stepCookingLevelSubtitle}
            />
        )}
        value={value}
        onChange={onChange}
    />
)
