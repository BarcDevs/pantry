import { AppDialog } from '@/components/shared/AppDialog'
import { Button } from '@/components/shared/buttons/Button'

import { recipesTexts } from '@/constants/texts/recipes'

type BulkDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
    count: number
}

export const BulkDeleteDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    count
}: BulkDeleteDialogProps) => (
    <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={recipesTexts.bulkDeleteDialog.title}
        description={recipesTexts.bulkDeleteDialog.description(count)}
        align={'center'}
        footer={(
            <>
                <Button
                    variant={'outline'}
                    onClick={() => onOpenChange(false)}
                >
                    {recipesTexts.bulkDeleteDialog.cancel}
                </Button>
                <Button
                    variant={'destructive'}
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? recipesTexts.detail.deleting
                        : recipesTexts.bulkDeleteDialog.confirm}
                </Button>
            </>
        )}
    />
)
