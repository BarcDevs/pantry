import type { Difficulty } from '@/types/enums'
import { DIFFICULTIES } from '@/types/enums'
import type { SetState } from '@/types/react'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepCookingLevelProps = {
    value: Difficulty | undefined
    onChange: SetState<Difficulty | undefined>
}

export const StepCookingLevel = ({
    value,
    onChange
}: StepCookingLevelProps) => (
    <div className={'flex flex-col gap-3'}>
        <h2 className={'text-heading font-bold text-ink'}>
            {onboardingTexts.stepCookingLevelTitle}
        </h2>
        <div className={'flex flex-col gap-2'}>
            {DIFFICULTIES.map((level) => (
                <Button
                    key={level}
                    variant={'ghost'}
                    onClick={() => onChange(level)}
                    className={cn(
                        'h-auto justify-start rounded-lg border px-4 py-3 text-start text-body font-normal transition-colors',
                        value === level
                            ? 'border-green bg-green/10 text-ink-green'
                            : 'border-border text-ink-2'
                    )}
                >
                    {onboardingTexts.cookingLevels[level]}
                </Button>
            ))}
        </div>
    </div>
)
