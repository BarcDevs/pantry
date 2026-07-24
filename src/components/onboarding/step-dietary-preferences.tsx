import type { SetState } from '@/types/react'

import { OnboardingStepHeader } from '@/components/onboarding/onboarding-step-header'
import { DietaryPreferencesPicker } from '@/components/shared/DietaryPreferencesPicker'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepDietaryPreferencesProps = {
    value: string[]
    onChange: SetState<string[]>
}

export const StepDietaryPreferences = ({
    value,
    onChange
}: StepDietaryPreferencesProps) => (
    <DietaryPreferencesPicker
        title={(
            <OnboardingStepHeader
                title={onboardingTexts.stepDietaryPreferencesTitle}
                subtitle={onboardingTexts.stepDietaryPreferencesSubtitle}
            />
        )}
        value={value}
        onChange={onChange}
        footer={(
            <p className={'mt-5.5 text-label text-ink-4'}>
                {value.length
                    ? `${onboardingTexts.dietaryCountPrefix} ${value.length}`
                    : onboardingTexts.dietaryCountEmpty}
            </p>
        )}
    />
)
