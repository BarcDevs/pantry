import { AppDialog } from '@/components/shared/AppDialog'
import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { recipesTexts } from '@/constants/texts/recipes'

type DeleteRecipeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
    recipeName: string
}

export const DeleteRecipeDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    recipeName
}: DeleteRecipeDialogProps) => (
    <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={recipesTexts.deleteDialog.title}
        description={recipesTexts.deleteDialog.description(recipeName)}
        align={'center'}
        footer={(
            <>
                <SecondaryButton onClick={() => onOpenChange(false)}>
                    {recipesTexts.deleteDialog.cancel}
                </SecondaryButton>
                <DestructiveButton
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? recipesTexts.detail.deleting
                        : recipesTexts.deleteDialog.confirm}
                </DestructiveButton>
            </>
        )}
    />
)
