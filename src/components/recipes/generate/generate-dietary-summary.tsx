import { useState } from 'react'

import { GenerateDietaryDialog }
    from '@/components/recipes/generate/generate-dietary-dialog'
import { Button } from '@/components/shared/Button'

import { onboardingTexts } from '@/constants/texts/onboarding'
import { recipesTexts } from '@/constants/texts/recipes'

type GenerateDietarySummaryProps = {
    dietaryPreferences: string[]
}

const texts = recipesTexts.generate

export const GenerateDietarySummary = ({
    dietaryPreferences
}: GenerateDietarySummaryProps) => {
    const [value, setValue] = useState(dietaryPreferences)
    const [isOpen, setIsOpen] = useState(false)

    const label = value.length
        ? value
            .map((key) => (
                onboardingTexts.dietaryOptions[
                    key as keyof typeof onboardingTexts.dietaryOptions
                ]?.label ?? key
            ))
            .join(' · ')
        : texts.dietaryPreferencesNone

    return (
        <>
            <Button
                type={'button'}
                variant={'ghost'}
                onClick={() => setIsOpen(true)}
                className={'flex h-auto w-full items-center justify-between rounded-lg border border-border-2 bg-surface p-4 font-normal shadow-none'}
            >
                <div className={'flex flex-col items-start gap-1'}>
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
            </Button>
            <GenerateDietaryDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                value={value}
                onSaved={setValue}
            />
        </>
    )
}
