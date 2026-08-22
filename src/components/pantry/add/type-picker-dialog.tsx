import type { FoodType } from '@/types/enums'
import { FOOD_TYPES } from '@/types/enums'

import { Button } from '@/components/shared/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

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
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent className={'rounded-2xl bg-canvas p-5.5'}>
            <DialogHeader>
                <DialogTitle className={'font-display text-heading font-bold text-ink'}>
                    {pantryTexts.addForm.typePickerTitle}
                </DialogTitle>
            </DialogHeader>
            <div className={'flex flex-wrap gap-2'}>
                {FOOD_TYPES.map((type) => (
                    <Button
                        key={type}
                        type={'button'}
                        variant={'ghost'}
                        onClick={() => {
                            onSelect(type)
                            onOpenChange(false)
                        }}
                        className={cn(
                            'h-auto gap-1.5 rounded-full border px-3.5 py-2 text-label',
                            value === type
                                ? 'border-green bg-soft-green-bg text-green'
                                : 'border-border-2 bg-surface text-ink-2'
                        )}
                    >
                        {pantryTexts.foodTypeLabels[type]}
                        <span>{foodTypeEmoji[type]}</span>
                    </Button>
                ))}
            </div>
            {onSkip && (
                <Button
                    type={'button'}
                    variant={'ghost'}
                    onClick={() => {
                        onSkip()
                        onOpenChange(false)
                    }}
                    className={'h-auto w-full font-bold text-body text-ink-3'}
                >
                    {pantryTexts.addForm.typePickerSkip}
                </Button>
            )}
        </DialogContent>
    </Dialog>
)
