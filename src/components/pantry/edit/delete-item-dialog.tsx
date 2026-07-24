import { Button } from '@/components/shared/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

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
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {pantryTexts.deleteDialog.title}
                </DialogTitle>
                <DialogDescription>
                    {pantryTexts.deleteDialog.description}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
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
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
