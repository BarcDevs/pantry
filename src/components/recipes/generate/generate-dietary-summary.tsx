import Link from 'next/link'

import { routes } from '@/constants/routes'
import { onboardingTexts } from '@/constants/texts/onboarding'
import { recipesTexts } from '@/constants/texts/recipes'

type GenerateDietarySummaryProps = {
    dietaryPreferences: string[]
}

const texts = recipesTexts.generate

export const GenerateDietarySummary = ({
    dietaryPreferences
}: GenerateDietarySummaryProps) => {
    const label = dietaryPreferences.length
        ? dietaryPreferences
            .map((key) => (
                onboardingTexts.dietaryOptions[
                    key as keyof typeof onboardingTexts.dietaryOptions
                ]?.label ?? key
            ))
            .join(' · ')
        : texts.dietaryPreferencesNone

    return (
        <Link
            href={routes.settings}
            className={'flex items-center justify-between rounded-lg border border-border-2 bg-surface p-4'}
        >
            <div className={'flex flex-col gap-1'}>
                <span className={'font-bold text-body text-ink'}>
                    {texts.dietaryPreferencesLabel}
                </span>
                <span className={'text-caption text-ink-3'}>
                    {label}
                </span>
            </div>
            <span className={'font-semibold text-body text-green'}>
                {texts.dietaryPreferencesEdit}
            </span>
        </Link>
    )
}
