import type { SetState } from '@/types/react'

import type { DietaryOptionKey } from '@/components/onboarding/dietary-preference-chip'
import { DietaryPreferenceChip } from '@/components/onboarding/dietary-preference-chip'
import { OnboardingStepHeader } from '@/components/onboarding/onboarding-step-header'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepDietaryPreferencesProps = {
    value: string[]
    onChange: SetState<string[]>
}

const toggle = (list: string[], option: string) =>
    list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option]

const dietaryOptionKeys = Object.keys(
    onboardingTexts.dietaryOptions
) as DietaryOptionKey[]

export const StepDietaryPreferences = ({
    value,
    onChange
}: StepDietaryPreferencesProps) => (
    <div className={'flex flex-col gap-2'}>
        <OnboardingStepHeader
            title={onboardingTexts.stepDietaryPreferencesTitle}
            subtitle={onboardingTexts.stepDietaryPreferencesSubtitle}
        />
        <div className={'flex flex-wrap gap-2.5'}>
            {dietaryOptionKeys.map((key) => (
                <DietaryPreferenceChip
                    key={key}
                    optionKey={key}
                    isSelected={value.includes(key)}
                    onToggle={() => onChange(toggle(value, key))}
                />
            ))}
        </div>
        <p className={'mt-5.5 text-label text-ink-4'}>
            {value.length
                ? `${onboardingTexts.dietaryCountPrefix} ${value.length}`
                : onboardingTexts.dietaryCountEmpty}
        </p>
    </div>
)
