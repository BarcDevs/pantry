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
                onSubmit={addItem.submission.submit}
                className={'flex flex-col gap-4 rounded-lg border border-border-2 bg-surface p-5'}
            >
                <span className={'font-bold text-body text-ink'}>
                    {pantryTexts.addForm.manualEntryTitle}
                </span>
                <AddItemFields
                    control={addItem.form.control}
                    nameCorrection={addItem.nameCorrection}
                />
                {addItem.merge.prompt && (
                    <ExistingItemPrompt
                        prompt={addItem.merge.prompt}
                        onMerge={addItem.merge.start}
                        onCancel={addItem.merge.cancel}
                    />
                )}
                {showSuggestionPanel && (
                    <StorageSuggestionHint
                        isLoading={addItem.suggestion.isSuggesting}
                        suggestion={addItem.suggestion.value}
                        suggestionFailed={addItem.suggestion.failed}
                        isStale={addItem.suggestion.stale}
                        currentStorage={currentStorage}
                        onSelectRecommended={addItem.suggestion.applyStorage}
                        onApplyExpiry={addItem.suggestion.applyExpiry}
                        onRetry={addItem.suggestion.retry}
                        onRefresh={addItem.suggestion.refresh}
                    />
                )}
                <PantryTypeRow
                    value={currentType}
                    onChange={(type) => addItem.form.setValue('type', type)}
                />
                <FormError errors={addItem.form.formState.errors}/>
                <PrimaryButton
                    type={'submit'}
                    disabled={addItem.submission.isSubmitting}
                    className={'w-full'}
                >
                    {addItem.submission.isSubmitting
                        ? pantryTexts.addForm.submitting
                        : pantryTexts.addForm.submit}
                </PrimaryButton>
                <DuplicateItemDialog
                    open={addItem.submission.duplicate.value !== null}
                    onOpenChange={(open) => {
                        if (!open) addItem.submission.duplicate.setValue(null)
                    }}
                    onMerge={addItem.submission.duplicate.merge}
                    onKeepSeparate={addItem.submission.duplicate.keepSeparate}
                />
                <TypePickerDialog
                    open={addItem.submission.typePicker.isOpen}
                    onOpenChange={addItem.submission.typePicker.setIsOpen}
                    value={currentType}
                    onSelect={addItem.submission.typePicker.select}
                    onSkip={addItem.submission.typePicker.skip}
                />
            </form>
        </Form>
    )
}
