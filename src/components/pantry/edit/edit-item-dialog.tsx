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
                    onSubmit={editItem.submission.submit}
                    className={'flex flex-col gap-4'}
                >
                    <AddItemFields control={editItem.form.control}/>
                    {(
                        canSuggest && (
                            editItem.suggestion.value
                            || editItem.suggestion.failed
                        )
                    ) ? (
                        <StorageSuggestionHint
                            isLoading={editItem.suggestion.isSuggesting}
                            suggestion={editItem.suggestion.value}
                            suggestionFailed={editItem.suggestion.failed}
                            currentStorage={currentStorage}
                            onSelectRecommended={editItem.suggestion.applyStorage}
                            onApplyExpiry={editItem.suggestion.applyExpiry}
                            onRetry={editItem.suggestion.request}
                            onRefresh={editItem.suggestion.refresh}
                        />
                    ) : (
                        <StorageSuggestionButton
                            disabled={!canSuggest}
                            isLoading={editItem.suggestion.isSuggesting}
                            onClick={editItem.suggestion.request}
                        />
                    )}
                    <PantryTypeRow
                        value={currentType}
                        onChange={(type) => editItem.form.setValue('type', type)}
                    />
                    <FormError errors={editItem.form.formState.errors}/>
                    <PrimaryButton
                        type={'submit'}
                        disabled={editItem.submission.isSubmitting}
                        className={'w-full'}
                    >
                        {editItem.submission.isSubmitting
                            ? pantryTexts.editForm.submitting
                            : pantryTexts.editForm.submit}
                    </PrimaryButton>
                    <DestructiveButton
                        className={'w-full'}
                        onClick={() => editItem.deletion.setIsConfirming(true)}
                    >
                        {pantryTexts.editForm.deleteButton}
                    </DestructiveButton>
                </form>
            </Form>
            <DeleteItemDialog
                open={editItem.deletion.isConfirming}
                onOpenChange={editItem.deletion.setIsConfirming}
                onConfirm={editItem.deletion.confirm}
                isDeleting={editItem.deletion.isDeleting}
            />
        </AppDialog>
    )
}
