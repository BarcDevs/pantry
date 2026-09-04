import { SparklesIcon } from 'lucide-react'

import { Button } from '@/components/shared/Button'

import { pantryTexts } from '@/constants/texts/pantry'

type StorageSuggestionButtonProps = {
    disabled: boolean
    isLoading: boolean
    onClick: () => void
}

export const StorageSuggestionButton = ({
    disabled,
    isLoading,
    onClick
}: StorageSuggestionButtonProps) => (
    <Button
        type={'button'}
        variant={'outline'}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={'w-full justify-center border-dashed border-soft-green-border bg-soft-green-bg font-bold text-caption text-green shadow-none hover:bg-soft-green-bg'}
    >
        <SparklesIcon
            size={14}
            className={'text-ember'}
        />
        {pantryTexts.addForm.suggestionTitle}
        {isLoading && (
            <span className={'size-3.25 animate-spin rounded-full border-2 border-soft-green-border border-t-green'}/>
        )}
    </Button>
)
