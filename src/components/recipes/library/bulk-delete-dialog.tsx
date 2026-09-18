import { AppDialog } from '@/components/shared/AppDialog'
import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

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
                <SecondaryButton onClick={() => onOpenChange(false)}>
                    {recipesTexts.bulkDeleteDialog.cancel}
                </SecondaryButton>
                <DestructiveButton
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? recipesTexts.detail.deleting
                        : recipesTexts.bulkDeleteDialog.confirm}
                </DestructiveButton>
            </>
        )}
    />
)
