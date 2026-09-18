import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'

import type { ExpiryStatus } from '@/lib/pantry/expiry-status'
import { cn } from '@/lib/utils'

import {
    EXPIRY_SOON_THRESHOLD_DAYS,
    EXPIRY_TONE_CLASSES
} from '@/constants/pantry'
import { pantryTexts } from '@/constants/texts/pantry'

const daysLabel = (status: ExpiryStatus) => {
    if (status.daysLeft === null) return pantryTexts.noExpiryLabel
    if (status.daysLeft === 0) return pantryTexts.expiredTodayLabel
    if (status.daysLeft < 0) return pantryTexts.expiredLabel
    if (status.daysLeft <= EXPIRY_SOON_THRESHOLD_DAYS) return `${status.daysLeft} ${pantryTexts.daysLeftLabel}`
    return pantryTexts.validLabel
}

const daysTooltip = (status: ExpiryStatus) => (
    status.daysLeft !== null && status.daysLeft > EXPIRY_SOON_THRESHOLD_DAYS
        ? `${status.daysLeft} ${pantryTexts.daysLeftLabel}`
        : null
)

export const PantryExpiryChip = ({ status }: { status: ExpiryStatus }) => {
    const chip = (
        <span className={cn('rounded-full px-2.5 py-1 text-caption font-bold', EXPIRY_TONE_CLASSES[status.tone])}>
            {daysLabel(status)}
        </span>
    )

    const tooltip = daysTooltip(status)
    if (!tooltip) return chip

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {chip}
            </TooltipTrigger>
            <TooltipContent>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    )
}
