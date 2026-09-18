import { SparklesIcon } from 'lucide-react'

import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { pantryTexts } from '@/constants/texts/pantry'

type StorageSuggestionButtonProps = {
    disabled: boolean
    isLoading: boolean
    onClick: () => void
    label?: string
}

export const StorageSuggestionButton = ({
    disabled,
    isLoading,
    onClick,
    label = pantryTexts.addForm.suggestionTitle
}: StorageSuggestionButtonProps) => (
    <SecondaryButton
        disabled={disabled || isLoading}
        onClick={onClick}
        className={'w-full justify-center border-dashed border-soft-green-border bg-soft-green-bg font-bold text-caption text-green hover:bg-soft-green-bg'}
    >
        <SparklesIcon
            size={14}
            className={'text-ember'}
        />
        {label}
        {isLoading && (
            <span className={'size-3.25 animate-spin rounded-full border-2 border-soft-green-border border-t-green'}/>
        )}
    </SecondaryButton>
)
