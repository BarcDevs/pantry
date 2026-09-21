import { RefreshCcwIcon } from 'lucide-react'

import { OutlinedActionButton } from '@/components/shared/buttons/OutlinedActionButton'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeRetryButtonProps = {
    isRetrying: boolean
    isDisabled: boolean
    onRetry: () => void
}

export const RecipeRetryButton = ({
    isRetrying,
    isDisabled,
    onRetry
}: RecipeRetryButtonProps) => (
    <OutlinedActionButton
        onClick={onRetry}
        disabled={isRetrying || isDisabled}
        className={'flex-1'}
    >
        <RefreshCcwIcon
            size={18}
            className={'stroke-ink-3'}
        />
        <span>
            {isRetrying
                ? recipesTexts.result.retrying
                : recipesTexts.result.retry}
        </span>
    </OutlinedActionButton>
)
