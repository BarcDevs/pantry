'use client'

import { AddItemFields } from '@/components/pantry/add/add-item-fields'
import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { StorageSuggestionHint } from '@/components/pantry/add/storage-suggestion-hint'
import { Button } from '@/components/shared/Button'

import { useAddItemForm } from '@/hooks/use-add-item-form'

import { pantryTexts } from '@/constants/texts/pantry'

export const AddItemForm = () => {
    const {
        values,
        handlers,
        suggestion,
        isSuggesting,
        isSubmitting,
        duplicate,
        setDuplicate,
        handleSubmit,
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage
    } = useAddItemForm()

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
            className={'flex flex-col gap-4'}
        >
            <AddItemFields
                values={values}
                handlers={handlers}
            />
            {isSuggesting && (
                <p className={'text-label text-ink-4'}>
                    {pantryTexts.addForm.suggestionLoading}
                </p>
            )}
            {suggestion && (
                <StorageSuggestionHint
                    suggestion={suggestion}
                    currentStorage={values.storage}
                    onSelectRecommended={applySuggestedStorage}
                />
            )}
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
        </form>
    )
}
