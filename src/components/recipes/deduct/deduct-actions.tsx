import { Button } from '@/components/shared/Button'

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
        <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={'w-full cursor-pointer bg-green text-body font-bold text-surface hover:bg-green/90'}
        >
            {recipesTexts.deduct.confirm}
        </Button>
        <Button
            variant={'ghost'}
            onClick={onSkip}
            disabled={isSubmitting}
            className={'w-full cursor-pointer text-body font-semibold text-ink-3'}
        >
            {recipesTexts.deduct.skip}
        </Button>
    </div>
)
