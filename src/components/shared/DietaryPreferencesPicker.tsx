import type { ReactNode } from 'react'

import { DietaryPreferenceChip } from '@/components/onboarding/dietary-preference-chip'

import { dietaryOptionKeys, toggleDietaryPreference } from '@/lib/dietary-preferences'

type DietaryPreferencesPickerProps = {
    title: ReactNode
    value: string[]
    onChange: (value: string[]) => void
    footer?: ReactNode
}

export const DietaryPreferencesPicker = ({
    title,
    value,
    onChange,
    footer
}: DietaryPreferencesPickerProps) => (
    <div className={'flex flex-col gap-2'}>
        {title}
        <div className={'flex flex-wrap gap-2.5'}>
            {dietaryOptionKeys.map((key) => (
                <DietaryPreferenceChip
                    key={key}
                    optionKey={key}
                    isSelected={value.includes(key)}
                    onToggle={() => onChange(toggleDietaryPreference(value, key))}
                />
            ))}
        </div>
        {footer}
    </div>
)
