import type { ReactNode } from 'react'

import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { MAX_HOUSEHOLD_SIZE, MIN_HOUSEHOLD_SIZE } from '@/constants/onboarding'
import { onboardingTexts } from '@/constants/texts/onboarding'

type HouseholdSizeStepperProps = {
    title: ReactNode
    value: number | undefined
    onChange: (size: number) => void
}

export const HouseholdSizeStepper = ({
    title,
    value,
    onChange
}: HouseholdSizeStepperProps) => {
    const size = value ?? MIN_HOUSEHOLD_SIZE

    return (
        <div className={'flex flex-col gap-2'}>
            {title}
            <div className={'flex items-center justify-center gap-6.5 rounded-lg border border-border-2 bg-surface px-6 py-7.5'}>
                <SecondaryButton
                    disabled={size <= MIN_HOUSEHOLD_SIZE}
                    onClick={() => onChange(size - 1)}
                    className={'size-13 shrink-0 rounded-full text-heading'}
                >
                    −
                </SecondaryButton>
                <div className={'min-w-24 text-center'}>
                    <div className={'font-display text-display font-weight-display text-green'}>
                        {size}
                    </div>
                    <div className={'mt-0.5 text-body text-ink-3'}>
                        {size === 1
                            ? onboardingTexts.householdSizeSingular
                            : `${size} ${onboardingTexts.householdSizePlural}`}
                    </div>
                </div>
                <SecondaryButton
                    disabled={size >= MAX_HOUSEHOLD_SIZE}
                    onClick={() => onChange(size + 1)}
                    className={'size-13 shrink-0 rounded-full text-heading'}
                >
                    +
                </SecondaryButton>
            </div>
        </div>
    )
}
