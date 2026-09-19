'use client'

import type { PantryItem } from '@/types/pantry-item'

import { AddItemFields }
    from '@/components/pantry/add/add-item-fields'
import { PantryTypeRow }
    from '@/components/pantry/add/pantry-type-row'
import { StorageSuggestionHint }
    from '@/components/pantry/add/storage-suggestion-hint'
import { DeleteItemDialog }
    from '@/components/pantry/edit/delete-item-dialog'
import { StorageSuggestionButton }
    from '@/components/pantry/edit/storage-suggestion-button'
import { AppDialog } from '@/components/shared/AppDialog'
import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

import { useEditItemForm } from '@/hooks/use-edit-item-form'

import { pantryTexts } from '@/constants/texts/pantry'

type EditItemDialogProps = {
    item: PantryItem
    onClose: () => void
    onSaved: () => void
    onDeleted: () => void
}

export const EditItemDialog = ({
    item,
    onClose,
    onSaved,
    onDeleted
}: EditItemDialogProps) => {
    const {
        form,
        suggestion,
        isSuggesting,
        suggestionFailed,
        isSubmitting,
        isDeleting,
        confirmDelete,
        setConfirmDelete,
        requestSuggestion,
        refreshSuggestion,
        handleSubmit,
        handleDelete,
        applySuggestedStorage,
        applySuggestedExpiry
    } = useEditItemForm({
        item,
        onSaved,
        onDeleted
    })

    const currentStorage = form.watch('storage')
    const currentType = form.watch('type')
    const name = form.watch('name')
    const canSuggest = name.trim().length >= 2

    return (
        <AppDialog
            open
            onOpenChange={(open) => { if (!open) onClose() }}
            title={pantryTexts.editForm.title}
            contentClassName={'max-h-[85vh] overflow-y-auto'}
        >
            <Form {...form}>
                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={'flex flex-col gap-4'}
                >
                    <AddItemFields control={form.control}/>
                    {(
                        canSuggest && (
                            suggestion
                            || suggestionFailed
                        )
                    ) ? (
                        <StorageSuggestionHint
                            isLoading={isSuggesting}
                            suggestion={suggestion}
                            suggestionFailed={suggestionFailed}
                            currentStorage={currentStorage}
                            onSelectRecommended={applySuggestedStorage}
                            onApplyExpiry={applySuggestedExpiry}
                            onRetry={requestSuggestion}
                            onRefresh={refreshSuggestion}
                        />
                    ) : (
                        <StorageSuggestionButton
                            disabled={!canSuggest}
                            isLoading={isSuggesting}
                            onClick={requestSuggestion}
                        />
                    )}
                    <PantryTypeRow
                        value={currentType}
                        onChange={(type) => form.setValue('type', type)}
                    />
                    <FormError errors={form.formState.errors}/>
                    <PrimaryButton
                        type={'submit'}
                        disabled={isSubmitting}
                        className={'w-full'}
                    >
                        {isSubmitting
                            ? pantryTexts.editForm.submitting
                            : pantryTexts.editForm.submit}
                    </PrimaryButton>
                    <DestructiveButton
                        className={'w-full'}
                        onClick={() => setConfirmDelete(true)}
                    >
                        {pantryTexts.editForm.deleteButton}
                    </DestructiveButton>
                </form>
            </Form>
            <DeleteItemDialog
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </AppDialog>
    )
}
