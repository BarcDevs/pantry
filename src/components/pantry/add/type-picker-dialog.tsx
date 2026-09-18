import type { FoodType } from '@/types/enums'
import { FOOD_TYPES } from '@/types/enums'

import { AppDialog } from '@/components/shared/AppDialog'
import { ChipButton } from '@/components/shared/buttons/ChipButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import { cn } from '@/lib/utils'

import { foodTypeEmoji } from '@/constants/food-type-emoji'
import { pantryTexts } from '@/constants/texts/pantry'

type TypePickerDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    value: FoodType | null
    onSelect: (type: FoodType) => void
    onSkip?: () => void
}

export const TypePickerDialog = ({
    open,
    onOpenChange,
    value,
    onSelect,
    onSkip
}: TypePickerDialogProps) => (
    <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={pantryTexts.addForm.typePickerTitle}
    >
        <div className={'flex flex-wrap gap-2'}>
            {FOOD_TYPES.map((type) => (
                <ChipButton
                    key={type}
                    isSelected={value === type}
                    onClick={() => {
                        onSelect(type)
                        onOpenChange(false)
                    }}
                    className={cn(
                        'border-border-2',
                        value === type && 'border-green bg-soft-green-bg text-green'
                    )}
                >
                    {pantryTexts.foodTypeLabels[type]}
                    <span>
                        {foodTypeEmoji[type]}
                    </span>
                </ChipButton>
            ))}
        </div>
        {onSkip && (
            <TextButton
                tone={'muted'}
                onClick={() => {
                    onSkip()
                    onOpenChange(false)
                }}
                className={'w-full text-body'}
            >
                {pantryTexts.addForm.typePickerSkip}
            </TextButton>
        )}
    </AppDialog>
)
