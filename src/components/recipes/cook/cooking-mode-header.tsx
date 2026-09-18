import Link from 'next/link'

import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { IconButton } from '@/components/shared/buttons/IconButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

type CookingModeHeaderProps = {
    title: string
    stepNumber: number
    totalSteps: number
    onDoneCooking: () => void
}

export const CookingModeHeader = ({
    title,
    stepNumber,
    totalSteps,
    onDoneCooking
}: CookingModeHeaderProps) => (
    <div className={'mb-6 flex items-center justify-between gap-3'}>
        <IconButton
            asChild
            className={'text-surface'}
        >
            <Link href={routes.recipes}>
                <ArrowRightIcon size={24}/>
            </Link>
        </IconButton>
        <div className={'flex-1 truncate text-center text-label font-semibold text-surface/60'}>
            {`${title} · ${stepNumber}/${totalSteps}`}
        </div>
        <SecondaryButton
            onClick={onDoneCooking}
            className={'shrink-0 gap-1.5 rounded-full border-surface/30 bg-surface/8 text-caption font-bold text-surface'}
        >
            <CheckIcon size={14}/>
            {recipesTexts.cook.doneCooking}
        </SecondaryButton>
    </div>
)
