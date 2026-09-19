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

import { minNameLengthForSuggestion } from '@/constants/pantry'
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
    const editItem = useEditItemForm({
        item,
        onSaved,
        onDeleted
    })

    const currentStorage = editItem.form.watch('storage')
    const currentType = editItem.form.watch('type')
    const name = editItem.form.watch('name')
    const canSuggest = name.trim().length >= minNameLengthForSuggestion

    return (
        <AppDialog
            open
            onOpenChange={(open) => { if (!open) onClose() }}
            title={pantryTexts.editForm.title}
            contentClassName={'max-h-[85vh] overflow-y-auto'}
        >
            <Form {...editItem.form}>
                <form
                    noValidate
                    onSubmit={editItem.handleSubmit}
                    className={'flex flex-col gap-4'}
                >
                    <AddItemFields control={editItem.form.control}/>
                    {(
                        canSuggest && (
                            editItem.suggestion
                            || editItem.suggestionFailed
                        )
                    ) ? (
                        <StorageSuggestionHint
                            isLoading={editItem.isSuggesting}
                            suggestion={editItem.suggestion}
                            suggestionFailed={editItem.suggestionFailed}
                            currentStorage={currentStorage}
                            onSelectRecommended={editItem.applySuggestedStorage}
                            onApplyExpiry={editItem.applySuggestedExpiry}
                            onRetry={editItem.requestSuggestion}
                            onRefresh={editItem.refreshSuggestion}
                        />
                    ) : (
                        <StorageSuggestionButton
                            disabled={!canSuggest}
                            isLoading={editItem.isSuggesting}
                            onClick={editItem.requestSuggestion}
                        />
                    )}
                    <PantryTypeRow
                        value={currentType}
                        onChange={(type) => editItem.form.setValue('type', type)}
                    />
                    <FormError errors={editItem.form.formState.errors}/>
                    <PrimaryButton
                        type={'submit'}
                        disabled={editItem.isSubmitting}
                        className={'w-full'}
                    >
                        {editItem.isSubmitting
                            ? pantryTexts.editForm.submitting
                            : pantryTexts.editForm.submit}
                    </PrimaryButton>
                    <DestructiveButton
                        className={'w-full'}
                        onClick={() => editItem.setConfirmDelete(true)}
                    >
                        {pantryTexts.editForm.deleteButton}
                    </DestructiveButton>
                </form>
            </Form>
            <DeleteItemDialog
                open={editItem.confirmDelete}
                onOpenChange={editItem.setConfirmDelete}
                onConfirm={editItem.handleDelete}
                isDeleting={editItem.isDeleting}
            />
        </AppDialog>
    )
}
