import { useState } from 'react'

import type { FoodType } from '@/types/enums'

import { TypePickerDialog } from '@/components/pantry/add/type-picker-dialog'
import { TextButton } from '@/components/shared/buttons/TextButton'

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
                    <TextButton
                        onClick={() => setIsPickerOpen(true)}
                        className={'ms-auto shrink-0 gap-1 text-caption'}
                    >
                        {pantryTexts.addForm.typeRowChange}
                    </TextButton>
                </div>
            ) : (
                <TextButton
                    tone={'muted'}
                    onClick={() => setIsPickerOpen(true)}
                    className={'text-caption'}
                >
                    {pantryTexts.addForm.typeRowAdd}
                </TextButton>
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
