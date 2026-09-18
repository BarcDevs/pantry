import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import { recipesTexts } from '@/constants/texts/recipes'

type DeductActionsProps = {
    isSubmitting: boolean
    onConfirm: () => void
    onSkip: () => void
}

export const DeductActions = ({
    isSubmitting,
    onConfirm,
    onSkip
}: DeductActionsProps) => (
    <div>
        <PrimaryButton
            onClick={onConfirm}
            disabled={isSubmitting}
            className={'w-full cursor-pointer bg-green text-body font-bold text-surface hover:bg-green/90'}
        >
            {recipesTexts.deduct.confirm}
        </PrimaryButton>
        <TextButton
            tone={'muted'}
            onClick={onSkip}
            disabled={isSubmitting}
            className={'w-full font-semibold text-body'}
        >
            {recipesTexts.deduct.skip}
        </TextButton>
    </div>
)
