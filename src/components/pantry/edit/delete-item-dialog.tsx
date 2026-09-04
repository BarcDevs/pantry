import { AppDialog } from '@/components/shared/AppDialog'
import { Button } from '@/components/shared/Button'

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
                <Button
                    variant={'outline'}
                    onClick={() => onOpenChange(false)}
                >
                    {pantryTexts.deleteDialog.cancel}
                </Button>
                <Button
                    variant={'destructive'}
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? pantryTexts.editForm.deleting
                        : pantryTexts.deleteDialog.confirm}
                </Button>
            </>
        )}
    />
)
