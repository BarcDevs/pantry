import type { ExpiryStatus } from '@/lib/pantry/expiry-status'
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
    if (status.daysLeft < 0) return pantryTexts.expiredLabel
    return `${status.daysLeft} ${pantryTexts.daysLeftLabel}`
}

export const PantryExpiryChip = ({ status }: { status: ExpiryStatus }) => (
    <span className={cn('rounded-full px-2.5 py-1 text-caption font-bold', TONE_CLASSES[status.tone])}>
        {daysLabel(status)}
    </span>
)
