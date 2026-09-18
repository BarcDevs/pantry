'use client'

import type { PantryItem } from '@/types/pantry-item'

import { PantrySelectRow } from '@/components/recipes/generate/pantry-select-row'
import { AppDialog } from '@/components/shared/AppDialog'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import { recipesTexts } from '@/constants/texts/recipes'

type PantrySelectSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    items: PantryItem[]
    selectedItemIds: string[]
    onToggleItem: (itemId: string) => void
    onToggleAll: () => void
}

export const PantrySelectSheet = ({
    open,
    onOpenChange,
    items,
    selectedItemIds,
    onToggleItem,
    onToggleAll
}: PantrySelectSheetProps) => {
    const texts = recipesTexts.pantrySheet
    const allSelected = items.length > 0 && selectedItemIds.length === items.length

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={texts.title}
            contentClassName={'flex max-h-[90vh] flex-col gap-0'}
        >
            <div className={'mb-4 flex items-center justify-between gap-2.5'}>
                <span className={'text-caption text-ink-3'}>
                    {texts.subtitle(selectedItemIds.length, items.length)}
                </span>
                <TextButton
                    onClick={onToggleAll}
                    className={'shrink-0 text-caption'}
                >
                    {texts.toggleAll(allSelected)}
                </TextButton>
            </div>
            <div className={'flex flex-1 flex-col gap-2.25 overflow-y-auto'}>
                {items.map((item) => (
                    <PantrySelectRow
                        key={item._id}
                        item={item}
                        isSelected={selectedItemIds.includes(item._id)}
                        onToggle={() => onToggleItem(item._id)}
                    />
                ))}
            </div>
            <PrimaryButton
                onClick={() => onOpenChange(false)}
                className={'mt-4.5'}
            >
                {texts.confirm}
            </PrimaryButton>
        </AppDialog>
    )
}
