'use client'

import type { PantryItem }
    from '@/types/pantry-item'

import { AddItemFields }
    from '@/components/pantry/add/add-item-fields'
import { PantryTypeRow }
    from '@/components/pantry/add/pantry-type-row'
import { StorageSuggestionHint }
    from '@/components/pantry/add/storage-suggestion-hint'
import { DeleteItemDialog }
    from '@/components/pantry/edit/delete-item-dialog'
import { Button }
    from '@/components/shared/Button'
import { FormError }
    from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'

import { useEditItemForm }
    from '@/hooks/use-edit-item-form'

import { pantryTexts }
    from '@/constants/texts/pantry'

type EditItemSheetProps = {
    item: PantryItem
    onClose: () => void
    onSaved: () => void
    onDeleted: () => void
}

export const EditItemSheet = ({
    item,
    onClose,
    onSaved,
    onDeleted
}: EditItemSheetProps) => {
    const {
        form,
        suggestion,
        isSuggesting,
        isSubmitting,
        isDeleting,
        confirmDelete,
        setConfirmDelete,
        requestSuggestion,
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

    return (
        <Sheet
            open
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
        >
            <SheetContent
                className={'overflow-y-auto p-4'}
            >
                <SheetHeader className={'p-0'}>
                    <SheetTitle>
                        {pantryTexts.editForm.title}
                    </SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit}
                        className={
                            'flex flex-col gap-4'
                        }
                    >
                        <AddItemFields
                            control={form.control}
                        />
                        <Button
                            type={'button'}
                            variant={'outline'}
                            disabled={isSuggesting}
                            onClick={requestSuggestion}
                        >
                            {isSuggesting
                                ? pantryTexts.editForm
                                    .suggesting
                                : pantryTexts.editForm
                                    .suggestButton}
                        </Button>
                        {suggestion && (
                            <StorageSuggestionHint
                                isLoading={false}
                                suggestion={
                                    suggestion
                                }
                                currentStorage={
                                    currentStorage
                                }
                                onSelectRecommended={
                                    applySuggestedStorage
                                }
                                onApplyExpiry={
                                    applySuggestedExpiry
                                }
                            />
                        )}
                        <PantryTypeRow
                            value={currentType}
                            onChange={(type) => form.setValue('type', type)}
                        />
                        <FormError
                            errors={
                                form.formState.errors
                            }
                        />
                        <Button
                            type={'submit'}
                            disabled={isSubmitting}
                            className={'w-full'}
                        >
                            {isSubmitting
                                ? pantryTexts.editForm
                                    .submitting
                                : pantryTexts.editForm
                                    .submit}
                        </Button>
                        <Button
                            type={'button'}
                            variant={'destructive'}
                            className={'w-full'}
                            onClick={() => (
                                setConfirmDelete(true)
                            )}
                        >
                            {
                                pantryTexts.editForm
                                    .deleteButton
                            }
                        </Button>
                    </form>
                </Form>
                <DeleteItemDialog
                    open={confirmDelete}
                    onOpenChange={
                        setConfirmDelete
                    }
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                />
            </SheetContent>
        </Sheet>
    )
}
