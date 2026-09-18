import { AppDialog } from '@/components/shared/AppDialog'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

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
                <SecondaryButton onClick={onKeepSeparate}>
                    {pantryTexts.duplicateDialog.keepSeparate}
                </SecondaryButton>
                <PrimaryButton onClick={onMerge}>
                    {pantryTexts.duplicateDialog.merge}
                </PrimaryButton>
            </>
        )}
    />
)
