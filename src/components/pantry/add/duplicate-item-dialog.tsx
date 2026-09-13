import { AppDialog } from '@/components/shared/AppDialog'
import { Button } from '@/components/shared/buttons/Button'

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
    <AppDialog
        open={open}
        onOpenChange={onOpenChange}
        title={pantryTexts.duplicateDialog.title}
        description={pantryTexts.duplicateDialog.description}
        footer={(
            <>
                <Button
                    variant={'outline'}
                    onClick={onKeepSeparate}
                >
                    {pantryTexts.duplicateDialog.keepSeparate}
                </Button>
                <Button onClick={onMerge}>
                    {pantryTexts.duplicateDialog.merge}
                </Button>
            </>
        )}
    />
)
