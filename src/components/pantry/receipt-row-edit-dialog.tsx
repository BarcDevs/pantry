import type { StorageLocation } from '@/types/enums'
import { STORAGE_LOCATIONS } from '@/types/enums'
import type { ReceiptReviewRow, ReceiptReviewRowEditPatch } from '@/types/receipt-review-row'

import { PantryTypeRow } from '@/components/pantry/add/pantry-type-row'
import { StorageSuggestionHint } from '@/components/pantry/add/storage-suggestion-hint'
import { StorageSuggestionButton } from '@/components/pantry/edit/storage-suggestion-button'
import { ReceiptRowExpiryField } from '@/components/pantry/receipt-row-expiry-field'
import { AppDialog } from '@/components/shared/AppDialog'
import { Button } from '@/components/shared/buttons/Button'
import { Input } from '@/components/shared/Input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { useReceiptRowEdit } from '@/hooks/use-receipt-row-edit'

import { toSelectOptions } from '@/lib/select-options'

import { pantryTexts } from '@/constants/texts/pantry'

const storageOptions = toSelectOptions(STORAGE_LOCATIONS, pantryTexts.storageLabels)

type ReceiptRowEditDialogProps = {
    row: ReceiptReviewRow
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (patch: ReceiptReviewRowEditPatch) => void
}

export const ReceiptRowEditDialog = ({
    row,
    open,
    onOpenChange,
    onSave
}: ReceiptRowEditDialogProps) => {
    const productEdit = useReceiptRowEdit(row)

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={pantryTexts.receiptReview.editRowTitle}
            footer={(
                <Button
                    onClick={() => {
                        onSave(productEdit.buildPatch())
                        onOpenChange(false)
                    }}
                    className={'w-full'}
                >
                    {pantryTexts.receiptReview.editRowDone}
                </Button>
            )}
        >
            <div className={'flex flex-col gap-4'}>
                <div>
                    <label className={'mb-1.75 block text-caption font-bold text-ink-3'}>
                        {pantryTexts.addForm.nameLabel}
                    </label>
                    <Input
                        value={productEdit.name}
                        onChange={(e) => productEdit.setName(e.target.value)}
                    />
                </div>
                <div className={'grid grid-cols-2 gap-3'}>
                    <div>
                        <label className={'mb-1.75 block text-caption font-bold text-ink-3'}>
                            {pantryTexts.addForm.storageLabel}
                        </label>
                        <Select
                            value={productEdit.storage}
                            onValueChange={(value: StorageLocation) => productEdit.setStorage(value)}
                        >
                            <SelectTrigger className={'w-full cursor-pointer'}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent position={'popper'}>
                                {storageOptions.map((option) => (
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
                    </div>
                    <div>
                        <label className={'mb-1.75 block text-caption font-bold text-ink-3'}>
                            {pantryTexts.addForm.expiryLabel}
                        </label>
                        <ReceiptRowExpiryField
                            value={productEdit.expiryDate}
                            onChange={productEdit.setExpiryDate}
                        />
                    </div>
                </div>
                <PantryTypeRow
                    value={productEdit.type}
                    onChange={productEdit.setType}
                />
                {(productEdit.suggestion || productEdit.suggestionFailed) ? (
                    <StorageSuggestionHint
                        isLoading={productEdit.isSuggesting}
                        suggestion={productEdit.suggestion}
                        suggestionFailed={productEdit.suggestionFailed}
                        currentStorage={productEdit.storage}
                        onSelectRecommended={productEdit.applySuggestedStorage}
                        onApplyExpiry={productEdit.applySuggestedExpiry}
                        onRetry={productEdit.requestSuggestion}
                    />
                ) : (
                    <StorageSuggestionButton
                        disabled={productEdit.name.trim().length < 2}
                        isLoading={productEdit.isSuggesting}
                        onClick={productEdit.requestSuggestion}
                    />
                )}
            </div>
        </AppDialog>
    )
}
