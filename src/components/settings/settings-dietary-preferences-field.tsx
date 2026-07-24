import { DietaryPreferencesPicker } from '@/components/shared/DietaryPreferencesPicker'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsDietaryPreferencesFieldProps = {
    value: string[]
    onChange: (value: string[]) => void
}

export const SettingsDietaryPreferencesField = ({
    value,
    onChange
}: SettingsDietaryPreferencesFieldProps) => (
    <DietaryPreferencesPicker
        title={(
            <h2 className={'text-heading font-bold text-ink'}>
                {settingsTexts.dietaryPreferencesTitle}
            </h2>
        )}
        value={value}
        onChange={onChange}
    />
)
