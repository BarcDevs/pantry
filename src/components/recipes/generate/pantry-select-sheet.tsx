'use client'

import { XIcon } from 'lucide-react'

import type { PantryItem } from '@/types/pantry-item'

import { PantrySelectRow } from '@/components/recipes/generate/pantry-select-row'
import { Button } from '@/components/shared/Button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

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
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                showCloseButton={false}
                className={'flex max-h-[90vh] flex-col gap-0 rounded-2xl bg-canvas p-5.5'}
            >
                <DialogHeader className={'flex-row items-center justify-between gap-3 space-y-0 py-px'}>
                    <DialogTitle className={'font-display text-heading font-bold text-ink'}>
                        {texts.title}
                    </DialogTitle>
                    <DialogClose
                        className={'flex size-8 shrink-0 items-center justify-center rounded-full border border-border-2 text-ink-4'}
                    >
                        <XIcon size={16}/>
                    </DialogClose>
                </DialogHeader>
                <div className={'mb-4 flex items-center justify-between gap-2.5'}>
                    <span className={'text-caption text-ink-3'}>
                        {texts.subtitle(selectedItemIds.length, items.length)}
                    </span>
                    <Button
                        type={'button'}
                        variant={'ghost'}
                        onClick={onToggleAll}
                        className={'h-auto shrink-0 p-0 font-bold text-caption text-green shadow-none'}
                    >
                        {texts.toggleAll(allSelected)}
                    </Button>
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
                <Button
                    onClick={() => onOpenChange(false)}
                    className={'mt-4.5'}
                >
                    {texts.confirm}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
