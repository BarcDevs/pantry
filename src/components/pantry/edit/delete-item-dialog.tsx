import { AppDialog } from '@/components/shared/AppDialog'
import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { pantryTexts } from '@/constants/texts/pantry'

type DeleteItemDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
}

export const DeleteItemDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isDeleting
}: DeleteItemDialogProps) => (
    <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={pantryTexts.deleteDialog.title}
        description={pantryTexts.deleteDialog.description}
        footer={(
            <>
                <SecondaryButton onClick={() => onOpenChange(false)}>
                    {pantryTexts.deleteDialog.cancel}
                </SecondaryButton>
                <DestructiveButton
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? pantryTexts.editForm.deleting
                        : pantryTexts.deleteDialog.confirm}
                </DestructiveButton>
            </>
        )}
    />
)
