import type { SetState } from '@/types/react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { onboardingTexts } from '@/constants/texts/onboarding'

type StepHouseholdSizeProps = {
    value: number | undefined
    onChange: SetState<number | undefined>
}

export const StepHouseholdSize = ({
    value,
    onChange
}: StepHouseholdSizeProps) => (
    <div className={'flex flex-col gap-3'}>
        <h2 className={'text-heading font-bold text-ink'}>
            {onboardingTexts.stepHouseholdSizeTitle}
        </h2>
        <Label className={'flex flex-col items-start gap-2 text-body text-ink-2'}>
            {onboardingTexts.householdSizeLabel}
            <Input
                type={'number'}
                min={1}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            />
        </Label>
    </div>
)
