import type { ReactNode } from 'react'

import type { DietaryOptionKey } from '@/components/onboarding/dietary-preference-chip'
import { DietaryPreferenceChip } from '@/components/onboarding/dietary-preference-chip'
import { AddCustomDietaryField } from '@/components/shared/AddCustomDietaryField'
import { CustomDietaryChip } from '@/components/shared/CustomDietaryChip'

import { dietaryOptionKeys, toggleDietaryPreference } from '@/lib/dietary-preferences'

const maxDietaryPreferences = 10

type DietaryPreferencesPickerProps = {
    title?: ReactNode
    value: string[]
    onChange: (value: string[]) => void
    footer?: ReactNode
}

export const DietaryPreferencesPicker = ({
    title,
    value,
    onChange,
    footer
}: DietaryPreferencesPickerProps) => {
    const customEntries = value.filter(
        (entry) => !dietaryOptionKeys.includes(entry as DietaryOptionKey)
    )

    return (
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
                {customEntries.map((entry) => (
                    <CustomDietaryChip
                        key={entry}
                        label={entry}
                        onRemove={() => onChange(value.filter((item) => item !== entry))}
                    />
                ))}
                <AddCustomDietaryField
                    disabled={value.length >= maxDietaryPreferences}
                    onAdd={(entry) => {
                        if (value.includes(entry)) return
                        onChange([...value, entry])
                    }}
                />
            </div>
            {footer}
        </div>
    )
}
