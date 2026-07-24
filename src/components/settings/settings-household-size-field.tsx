import { HouseholdSizeStepper } from '@/components/shared/HouseholdSizeStepper'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsHouseholdSizeFieldProps = {
    value: number | undefined
    onChange: (size: number) => void
}

export const SettingsHouseholdSizeField = ({
    value,
    onChange
}: SettingsHouseholdSizeFieldProps) => (
    <HouseholdSizeStepper
        title={(
            <h2 className={'text-heading font-bold text-ink'}>
                {settingsTexts.householdSizeTitle}
            </h2>
        )}
        value={value}
        onChange={onChange}
    />
)
