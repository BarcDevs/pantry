import Link from 'next/link'

import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { Button } from '@/components/shared/buttons/Button'

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
        <Button
            asChild
            variant={'ghost'}
            className={'shrink-0 p-0 text-surface'}
        >
            <Link href={routes.recipes}>
                <ArrowRightIcon size={24}/>
            </Link>
        </Button>
        <div className={'flex-1 truncate text-center text-label font-semibold text-surface/60'}>
            {`${title} · ${stepNumber}/${totalSteps}`}
        </div>
        <Button
            variant={'outline'}
            onClick={onDoneCooking}
            className={'shrink-0 gap-1.5 rounded-full border-surface/30 bg-surface/8 text-caption font-bold text-surface'}
        >
            <CheckIcon size={14}/>
            {recipesTexts.cook.doneCooking}
        </Button>
    </div>
)
