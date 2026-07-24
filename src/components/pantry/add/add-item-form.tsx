'use client'

import { AddItemFields } from '@/components/pantry/add/add-item-fields'
import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { StorageSuggestionHint } from '@/components/pantry/add/storage-suggestion-hint'
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
        handleSubmit,
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage
    } = useAddItemForm()

    const currentStorage = form.watch('storage')

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit}
                className={'flex flex-col gap-4'}
            >
                <AddItemFields control={form.control}/>
                {isSuggesting && (
                    <p className={'text-label text-ink-4'}>
                        {pantryTexts.addForm.suggestionLoading}
                    </p>
                )}
                {suggestion && (
                    <StorageSuggestionHint
                        suggestion={suggestion}
                        currentStorage={currentStorage}
                        onSelectRecommended={applySuggestedStorage}
                    />
                )}
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
            </form>
        </Form>
    )
}
