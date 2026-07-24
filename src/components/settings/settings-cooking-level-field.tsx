import type { Difficulty } from '@/types/enums'

import { CookingLevelPicker } from '@/components/shared/CookingLevelPicker'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsCookingLevelFieldProps = {
    value: Difficulty | undefined
    onChange: (level: Difficulty) => void
}

export const SettingsCookingLevelField = ({
    value,
    onChange
}: SettingsCookingLevelFieldProps) => (
    <CookingLevelPicker
        title={(
            <h2 className={'text-heading font-bold text-ink'}>
                {settingsTexts.cookingLevelTitle}
            </h2>
        )}
        value={value}
        onChange={onChange}
    />
)
