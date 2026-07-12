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

type DuplicateItemDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onMerge: () => void
    onKeepSeparate: () => void
}

export const DuplicateItemDialog = ({
    open,
    onOpenChange,
    onMerge,
    onKeepSeparate
}: DuplicateItemDialogProps) => (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {pantryTexts.duplicateDialog.title}
                </DialogTitle>
                <DialogDescription>
                    {pantryTexts.duplicateDialog.description}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant={'outline'}
                    onClick={onKeepSeparate}
                >
                    {pantryTexts.duplicateDialog.keepSeparate}
                </Button>
                <Button onClick={onMerge}>
                    {pantryTexts.duplicateDialog.merge}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
