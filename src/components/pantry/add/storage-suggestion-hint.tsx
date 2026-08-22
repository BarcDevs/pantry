import { CheckIcon } from 'lucide-react'

import type { StorageLocation } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

import { Button } from '@/components/shared/Button'

import { pantryTexts } from '@/constants/texts/pantry'

type StorageSuggestionHintProps = {
    suggestion: StorageSuggestion
    currentStorage: StorageLocation
    onSelectRecommended: () => void
}

export const StorageSuggestionHint = ({
    suggestion,
    currentStorage,
    onSelectRecommended
}: StorageSuggestionHintProps) => {
    const isMatch = currentStorage === suggestion.suggestedStorage
    const current = suggestion.expiryByStorage[currentStorage]
    const recommended = suggestion.expiryByStorage[suggestion.suggestedStorage]

    if (isMatch) {
        return (
            <div className={'flex items-start gap-2 rounded-lg border border-soft-green-border bg-soft-green-bg p-3 text-label'}>
                <CheckIcon
                    size={16}
                    className={'mt-0.5 shrink-0 text-green'}
                />
                <div>
                    <div className={'font-weight-label text-green'}>
                        {pantryTexts.addForm.suggestionMatchTitle}
                    </div>
                    <div className={'mt-0.5 text-ink-3'}>
                        {current.reason}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'flex flex-col gap-2.5 rounded-lg border border-border-2 bg-canvas p-3 text-label'}>
            <div className={'font-weight-label text-ink'}>
                {pantryTexts.addForm.suggestionMismatchTitle}
            </div>
            <div className={'flex flex-col gap-1.5'}>
                <div className={'text-ink-3'}>
                    {`${pantryTexts.addForm.currentOptionLabel} (${pantryTexts.storageLabels[currentStorage]}): ${current.reason}`}
                </div>
                <div className={'text-ink-3'}>
                    {`${pantryTexts.addForm.recommendedOptionLabel} (${pantryTexts.storageLabels[suggestion.suggestedStorage]}): ${recommended.reason}`}
                </div>
            </div>
            <Button
                type={'button'}
                variant={'outline'}
                onClick={onSelectRecommended}
                className={'h-auto w-fit px-3 py-1.5 text-label'}
            >
                {pantryTexts.addForm.selectRecommended}
            </Button>
        </div>
    )
}
