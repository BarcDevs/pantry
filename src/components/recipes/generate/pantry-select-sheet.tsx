'use client'

import type { PantryItem } from '@/types/pantry-item'

import { PantrySelectRow } from '@/components/recipes/generate/pantry-select-row'
import { Button } from '@/components/shared/Button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'

import { recipesTexts } from '@/constants/texts/recipes'

type PantrySelectSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    items: PantryItem[]
    selectedItemIds: string[]
    onToggleItem: (itemId: string) => void
}

export const PantrySelectSheet = ({
    open,
    onOpenChange,
    items,
    selectedItemIds,
    onToggleItem
}: PantrySelectSheetProps) => (
    <Sheet
        open={open}
        onOpenChange={onOpenChange}
    >
        <SheetContent side={'bottom'}>
            <SheetHeader>
                <SheetTitle>
                    {recipesTexts.pantrySheet.title}
                </SheetTitle>
            </SheetHeader>
            <div className={'flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-4'}>
                {items.map((item) => (
                    <PantrySelectRow
                        key={item._id}
                        item={item}
                        isSelected={selectedItemIds.includes(item._id)}
                        onToggle={() => onToggleItem(item._id)}
                    />
                ))}
            </div>
            <Button
                onClick={() => onOpenChange(false)}
                className={'m-4'}
            >
                {recipesTexts.pantrySheet.done}
            </Button>
        </SheetContent>
    </Sheet>
)
