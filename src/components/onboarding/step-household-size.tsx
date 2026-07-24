import type { SetState } from '@/types/react'

import { OnboardingStepHeader } from '@/components/onboarding/onboarding-step-header'
import { HouseholdSizeStepper } from '@/components/shared/HouseholdSizeStepper'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepHouseholdSizeProps = {
    value: number | undefined
    onChange: SetState<number | undefined>
}

export const StepHouseholdSize = ({
    value,
    onChange
}: StepHouseholdSizeProps) => (
    <HouseholdSizeStepper
        title={(
            <OnboardingStepHeader
                title={onboardingTexts.stepHouseholdSizeTitle}
                subtitle={onboardingTexts.stepHouseholdSizeSubtitle}
            />
        )}
        value={value}
        onChange={onChange}
    />
)
