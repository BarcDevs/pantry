import type { DeductRow as DeductRowType } from '@/types/pantry-item'

import { DeductRowStepper } from '@/components/recipes/deduct/deduct-row-stepper'
import { DeductZeroWarning } from '@/components/recipes/deduct/deduct-zero-warning'

import { getFoodTypeIcon } from '@/lib/pantry/food-type-icon'
import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'
import { recipesTexts } from '@/constants/texts/recipes'

type DeductRowProps = {
    row: DeductRowType
    onMinus: () => void
    onPlus: () => void
    onKeep: () => void
    onDelete: () => void
}

export const DeductRow = ({
    row,
    onMinus,
    onPlus,
    onKeep,
    onDelete
}: DeductRowProps) => {
    const remaining = row.pantryQty - row.used
    const isZero = remaining <= 0

    return (
        <div className={'border-b border-border-3 py-3.5 last:border-b-0'}>
            <div className={'flex items-center gap-3.25'}>
                <span className={'text-heading'}>
                    {getFoodTypeIcon(row.type)}
                </span>
                <div className={'min-w-0 flex-1'}>
                    <div className={'text-body font-bold text-ink'}>
                        {row.name}
                    </div>
                    <div
                        className={cn(
                            'text-caption font-semibold',
                            isZero ? 'text-status-red-fg' : 'text-ink-3'
                        )}
                    >
                        {`${recipesTexts.deduct.remainingLabel}: ${Math.max(0, remaining)} ${pantryTexts.unitLabels[row.unit]}`}
                    </div>
                </div>
                <DeductRowStepper
                    used={row.used}
                    unit={pantryTexts.unitLabels[row.unit]}
                    onMinus={onMinus}
                    onPlus={onPlus}
                />
            </div>
            {isZero && (
                <DeductZeroWarning
                    choice={row.choice}
                    onKeep={onKeep}
                    onDelete={onDelete}
                />
            )}
        </div>
    )
}
