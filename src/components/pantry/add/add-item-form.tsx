'use client'

import { AddItemFields } from '@/components/pantry/add/add-item-fields'
import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { ExistingItemPrompt } from '@/components/pantry/add/existing-item-prompt'
import { PantryTypeRow } from '@/components/pantry/add/pantry-type-row'
import { StorageSuggestionHint } from '@/components/pantry/add/storage-suggestion-hint'
import { TypePickerDialog } from '@/components/pantry/add/type-picker-dialog'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

import { useAddItemForm } from '@/hooks/use-add-item-form'

import type { AddItemPrefill } from '@/lib/pantry/parse-add-item-prefill'

import { minNameLengthForSuggestion } from '@/constants/pantry'
import { pantryTexts } from '@/constants/texts/pantry'

type AddItemFormProps = {
    prefill?: AddItemPrefill
}

export const AddItemForm = ({ prefill }: AddItemFormProps) => {
    const addItem = useAddItemForm(prefill)

    const currentStorage = addItem.form.watch('storage')
    const currentType = addItem.form.watch('type')
    const name = addItem.form.watch('name')
    const showSuggestionPanel = name.trim().length >= minNameLengthForSuggestion

    return (
        <Form {...addItem.form}>
            <form
                noValidate
                onSubmit={addItem.handleSubmit}
                className={'flex flex-col gap-4 rounded-lg border border-border-2 bg-surface p-5'}
            >
                <span className={'font-bold text-body text-ink'}>
                    {pantryTexts.addForm.manualEntryTitle}
                </span>
                <AddItemFields control={addItem.form.control}/>
                {addItem.mergePrompt && (
                    <ExistingItemPrompt
                        prompt={addItem.mergePrompt}
                        onMerge={addItem.startMerge}
                        onCancel={addItem.cancelMerge}
                    />
                )}
                {showSuggestionPanel && (
                    <StorageSuggestionHint
                        isLoading={addItem.isSuggesting}
                        suggestion={addItem.suggestion}
                        suggestionFailed={addItem.suggestionFailed}
                        currentStorage={currentStorage}
                        onSelectRecommended={addItem.applySuggestedStorage}
                        onApplyExpiry={addItem.applySuggestedExpiry}
                        onRetry={addItem.retrySuggestion}
                        onRefresh={addItem.retrySuggestion}
                    />
                )}
                <PantryTypeRow
                    value={currentType}
                    onChange={(type) => addItem.form.setValue('type', type)}
                />
                <FormError errors={addItem.form.formState.errors}/>
                <PrimaryButton
                    type={'submit'}
                    disabled={addItem.isSubmitting}
                    className={'w-full'}
                >
                    {addItem.isSubmitting
                        ? pantryTexts.addForm.submitting
                        : pantryTexts.addForm.submit}
                </PrimaryButton>
                <DuplicateItemDialog
                    open={addItem.duplicate !== null}
                    onOpenChange={(open) => {
                        if (!open) addItem.setDuplicate(null)
                    }}
                    onMerge={addItem.handleMerge}
                    onKeepSeparate={addItem.handleKeepSeparate}
                />
                <TypePickerDialog
                    open={addItem.isTypePickerOpen}
                    onOpenChange={addItem.setIsTypePickerOpen}
                    value={currentType}
                    onSelect={addItem.selectPendingType}
                    onSkip={addItem.skipPendingType}
                />
            </form>
        </Form>
    )
}
