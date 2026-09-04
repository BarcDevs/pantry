import { useState } from 'react'

import type { FoodType } from '@/types/enums'

import { TypePickerDialog } from '@/components/pantry/add/type-picker-dialog'
import { Button } from '@/components/shared/Button'

import { foodTypeEmoji } from '@/constants/food-type-emoji'
import { pantryTexts } from '@/constants/texts/pantry'

type PantryTypeRowProps = {
    value: FoodType | null
    onChange: (type: FoodType) => void
}

export const PantryTypeRow = ({
    value,
    onChange
}: PantryTypeRowProps) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false)

    return (
        <>
            {value ? (
                <div className={'flex items-center gap-2.5 rounded-md border border-border-2 bg-border-3/50 px-3.25 py-2.5'}>
                    <span className={'shrink-0 font-bold text-caption text-ink-3'}>
                        {pantryTexts.addForm.typeRowLabel}
                    </span>
                    <span className={'flex items-center gap-1.5 rounded-full border border-border-2 bg-surface px-2.75 py-1.25 font-bold text-label text-ink'}>
                        {pantryTexts.foodTypeLabels[value]}
                        <span>
                            {foodTypeEmoji[value]}
                        </span>
                    </span>
                    <Button
                        type={'button'}
                        variant={'ghost'}
                        onClick={() => setIsPickerOpen(true)}
                        className={'ms-auto h-auto shrink-0 gap-1 p-0 font-bold text-caption text-green shadow-none'}
                    >
                        {pantryTexts.addForm.typeRowChange}
                    </Button>
                </div>
            ) : (
                <Button
                    type={'button'}
                    variant={'ghost'}
                    onClick={() => setIsPickerOpen(true)}
                    className={'h-auto w-fit p-0 font-bold text-caption text-ink-3 shadow-none'}
                >
                    {pantryTexts.addForm.typeRowAdd}
                </Button>
            )}
            <TypePickerDialog
                open={isPickerOpen}
                onOpenChange={setIsPickerOpen}
                value={value}
                onSelect={onChange}
            />
        </>
    )
}
