import { useState } from 'react'

import {
    CheckIcon,
    PencilIcon,
    XIcon
} from 'lucide-react'

import type { PantryUnit } from '@/types/enums'
import { PANTRY_UNITS } from '@/types/enums'
import type {
    ReceiptReviewRow as Row,
    ReceiptReviewRowActions
} from '@/types/receipt-review-row'

import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { ReceiptRowEditDialog } from '@/components/pantry/receipt-row-edit-dialog'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { getExpiryStatus } from '@/lib/pantry/expiry-status'
import { quantityStepByUnit } from '@/lib/pantry/quantity-step-by-unit'
import { toSelectOptions } from '@/lib/select-options'
import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

const unitOptions = toSelectOptions(PANTRY_UNITS, pantryTexts.unitLabels)

type ReceiptReviewRowProps = {
    row: Row
    actions: ReceiptReviewRowActions
}

export const ReceiptReviewRow = ({
    row,
    actions: {
        onToggle,
        onQuantityChange,
        onUnitChange,
        onEditSave,
        onRemove
    }
}: ReceiptReviewRowProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const step = quantityStepByUnit[row.unit]
    const expiryStatus = row.storageSuggestion
        ? getExpiryStatus(row.expiryDate ? new Date(row.expiryDate) : undefined)
        : null
    const subtitle = expiryStatus && (
        `${pantryTexts.storageLabels[row.storage]} · ${
            expiryStatus.daysLeft === null
                ? pantryTexts.validLabel
                : expiryStatus.daysLeft === 0
                    ? pantryTexts.expiredTodayLabel
                    : expiryStatus.daysLeft < 0
                        ? pantryTexts.expiredLabel
                        : pantryTexts.receiptReview.rowExpirySoon(expiryStatus.daysLeft)
        }`
    )

    return (
        <div className={'flex items-center gap-2.5 rounded-lg border border-border-2 bg-surface p-3'}>
            <button
                type={'button'}
                onClick={() => onToggle(row.id)}
                aria-label={row.name}
                aria-pressed={row.included}
                className={cn(
                    'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm border-1.5',
                    row.included
                        ? 'border-green bg-green'
                        : 'border-track bg-surface'
                )}
            >
                {row.included && (
                    <CheckIcon
                        size={14}
                        className={'text-surface'}
                    />
                )}
            </button>
            <span className={'min-w-0 flex-1'}>
                <span className={'block truncate text-body font-bold text-ink'}>
                    {row.name}
                </span>
                {subtitle && (
                    <span className={'block truncate text-caption text-ink-3'}>
                        {subtitle}
                    </span>
                )}
            </span>
            <Button
                type={'button'}
                variant={'outline'}
                size={'icon'}
                onClick={() => setIsEditOpen(true)}
            >
                <PencilIcon size={16}/>
            </Button>
            <div className={'flex shrink-0 items-center overflow-hidden rounded-lg border border-border'}>
                <Button
                    type={'button'}
                    variant={'ghost'}
                    size={'icon'}
                    disabled={row.quantity <= step}
                    onClick={() => onQuantityChange(
                        row.id,
                        Math.round((row.quantity - step) * 100) / 100
                    )}
                    className={'cursor-pointer rounded-none text-green'}
                >
                    <MinusIcon size={16}/>
                </Button>
                <Input
                    type={'number'}
                    value={row.quantity}
                    step={step}
                    onChange={(e) => onQuantityChange(
                        row.id,
                        Number(e.target.value)
                    )}
                    className={'h-9 w-14 shrink-0 border-none text-center shadow-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'}
                />
                <Button
                    type={'button'}
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => onQuantityChange(
                        row.id,
                        Math.round((row.quantity + step) * 100) / 100
                    )}
                    className={'cursor-pointer rounded-none text-green'}
                >
                    <PlusIcon size={16}/>
                </Button>
            </div>
            <Select
                value={row.unit}
                onValueChange={(unit: PantryUnit) => onUnitChange(row.id, unit)}
            >
                <SelectTrigger className={'w-20 shrink-0 cursor-pointer gap-1 px-2 text-caption text-ink-3'}>
                    <SelectValue>
                        {pantryTexts.unitShortLabels[row.unit]}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent position={'popper'}>
                    {unitOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className={'cursor-pointer'}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                type={'button'}
                variant={'outline'}
                size={'icon'}
                onClick={() => onRemove(row.id)}
            >
                <XIcon size={16}/>
            </Button>
            {isEditOpen && (
                <ReceiptRowEditDialog
                    row={row}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    onSave={(patch) => onEditSave(row.id, patch)}
                />
            )}
        </div>
    )
}
