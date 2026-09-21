import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'
import { CenteredModal } from '@/components/shared/CenteredModal'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeNoMatchDialogProps = {
    open: boolean
    dish: string
    isBusy?: boolean
    onEnableAi: () => void
    onEditRequest: () => void
    onClose?: () => void
}

const texts = recipesTexts.generate.noMatchDialog

const buttonShapeClass = 'h-auto w-full rounded-[12px] p-3.25 text-[14px] font-bold shadow-none'

export const RecipeNoMatchDialog = ({
    open,
    dish,
    isBusy = false,
    onEnableAi,
    onEditRequest,
    onClose = onEditRequest
}: RecipeNoMatchDialogProps) => (
    <CenteredModal
        open={open}
        onOpenChange={(isOpen) => !isOpen && onClose()}
        icon={texts.icon}
        title={texts.title}
        description={dish ? texts.body(dish) : texts.bodyWithoutDish}
    >
        <PrimaryButton
            disabled={isBusy}
            onClick={onEnableAi}
            className={buttonShapeClass}
        >
            {texts.enableAi}
        </PrimaryButton>
        <SecondaryButton
            disabled={isBusy}
            onClick={onEditRequest}
            className={`${buttonShapeClass} border-border bg-surface text-ink`}
        >
            {texts.editRequest}
        </SecondaryButton>
    </CenteredModal>
)
