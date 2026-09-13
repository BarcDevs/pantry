import { AppDialog } from '@/components/shared/AppDialog'
import { Button } from '@/components/shared/buttons/Button'

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
                <Button
                    variant={'outline'}
                    onClick={() => onOpenChange(false)}
                >
                    {recipesTexts.deleteDialog.cancel}
                </Button>
                <Button
                    variant={'destructive'}
                    disabled={isDeleting}
                    onClick={onConfirm}
                >
                    {isDeleting
                        ? recipesTexts.detail.deleting
                        : recipesTexts.deleteDialog.confirm}
                </Button>
            </>
        )}
    />
)
