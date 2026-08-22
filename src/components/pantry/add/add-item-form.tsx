'use client'

import { AddItemFields } from '@/components/pantry/add/add-item-fields'
import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { PantryTypeRow } from '@/components/pantry/add/pantry-type-row'
import { StorageSuggestionHint } from '@/components/pantry/add/storage-suggestion-hint'
import { TypePickerDialog } from '@/components/pantry/add/type-picker-dialog'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

import { useAddItemForm } from '@/hooks/use-add-item-form'

import { pantryTexts } from '@/constants/texts/pantry'

export const AddItemForm = () => {
    const {
        form,
        suggestion,
        isSuggesting,
        isSubmitting,
        duplicate,
        setDuplicate,
        isTypePickerOpen,
        setIsTypePickerOpen,
        handleSubmit,
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage,
        applySuggestedExpiry,
        selectPendingType,
        skipPendingType
    } = useAddItemForm()

    const currentStorage = form.watch('storage')
    const currentType = form.watch('type')
    const name = form.watch('name')
    const showSuggestionPanel = name.trim().length >= 2

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit}
                className={'flex flex-col gap-4'}
            >
                <AddItemFields control={form.control}/>
                {showSuggestionPanel && (
                    <StorageSuggestionHint
                        isLoading={isSuggesting}
                        suggestion={suggestion}
                        currentStorage={currentStorage}
                        onSelectRecommended={applySuggestedStorage}
                        onApplyExpiry={applySuggestedExpiry}
                    />
                )}
                <PantryTypeRow
                    value={currentType}
                    onChange={(type) => form.setValue('type', type)}
                />
                <FormError errors={form.formState.errors}/>
                <Button
                    type={'submit'}
                    disabled={isSubmitting}
                    className={'w-full'}
                >
                    {isSubmitting
                        ? pantryTexts.addForm.submitting
                        : pantryTexts.addForm.submit}
                </Button>
                <DuplicateItemDialog
                    open={duplicate !== null}
                    onOpenChange={(open) => { if (!open) setDuplicate(null) }}
                    onMerge={handleMerge}
                    onKeepSeparate={handleKeepSeparate}
                />
                <TypePickerDialog
                    open={isTypePickerOpen}
                    onOpenChange={setIsTypePickerOpen}
                    value={currentType}
                    onSelect={selectPendingType}
                    onSkip={skipPendingType}
                />
            </form>
        </Form>
    )
}
