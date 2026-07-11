import type { SetState } from '@/types/react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepDietaryPreferencesProps = {
    value: string[]
    onChange: SetState<string[]>
}

const toggle = (list: string[], option: string) =>
    list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option]

export const StepDietaryPreferences = ({
    value,
    onChange
}: StepDietaryPreferencesProps) => (
    <div className={'flex flex-col gap-3'}>
        <h2 className={'text-heading font-bold text-ink'}>
            {onboardingTexts.stepDietaryPreferencesTitle}
        </h2>
        <div className={'flex flex-col gap-3'}>
            {Object.entries(
                onboardingTexts.dietaryOptions
            ).map(([key, label]) => (
                <Label
                    key={key}
                    className={'flex items-center gap-2 text-body text-ink-2'}
                >
                    <Checkbox
                        checked={value.includes(key)}
                        onCheckedChange={() => onChange(toggle(value, key))}
                    />
                    {label}
                </Label>
            ))}
        </div>
    </div>
)
