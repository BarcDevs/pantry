import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'

import { EXPIRY_SOON_THRESHOLD_DAYS, type ExpiryStatus } from '@/lib/pantry/expiry-status'
import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

const TONE_CLASSES = {
    none: 'bg-track text-ink-3',
    green: 'bg-status-green-bg text-status-green-fg',
    amber: 'bg-status-amber-bg text-status-amber-fg',
    red: 'bg-status-red-bg text-status-red-fg'
} as const

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
        <span className={cn('rounded-full px-2.5 py-1 text-caption font-bold', TONE_CLASSES[status.tone])}>
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
