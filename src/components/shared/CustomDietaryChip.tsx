import { XIcon } from 'lucide-react'

import { Button } from '@/components/shared/buttons/Button'

import { onboardingTexts } from '@/constants/texts/onboarding'

type CustomDietaryChipProps = {
    label: string
    onRemove: () => void
}

export const CustomDietaryChip = ({
    label,
    onRemove
}: CustomDietaryChipProps) => (
    <span className={'flex items-center gap-1 rounded-full border border-green bg-green/10 py-1.5 pe-1.5 ps-4 text-label font-weight-label text-ink-green'}>
        {label}
        <Button
            variant={'ghost'}
            size={'icon-xs'}
            aria-label={onboardingTexts.dietaryCustomRemove}
            onClick={onRemove}
            className={'size-5 shadow-none'}
        >
            <XIcon/>
        </Button>
    </span>
)
