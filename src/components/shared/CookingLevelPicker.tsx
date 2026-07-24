import type { ReactNode } from 'react'

import type { Difficulty } from '@/types/enums'
import { DIFFICULTIES } from '@/types/enums'

import { CookingLevelOption } from '@/components/onboarding/cooking-level-option'

type CookingLevelPickerProps = {
    title: ReactNode
    value: Difficulty | undefined
    onChange: (level: Difficulty) => void
}

export const CookingLevelPicker = ({
    title,
    value,
    onChange
}: CookingLevelPickerProps) => (
    <div className={'flex flex-col gap-2'}>
        {title}
        <div className={'flex flex-col gap-3'}>
            {DIFFICULTIES.map((level) => (
                <CookingLevelOption
                    key={level}
                    level={level}
                    isSelected={value === level}
                    onSelect={() => onChange(level)}
                />
            ))}
        </div>
    </div>
)
