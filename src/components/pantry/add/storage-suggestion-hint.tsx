import {
    CheckIcon,
    RefreshCwIcon,
    SparklesIcon
} from 'lucide-react'

import type { StorageLocation } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

import { IconButton } from '@/components/shared/buttons/IconButton'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { pantryTexts } from '@/constants/texts/pantry'
import { dayInMs } from '@/constants/time'

const daysUntil = (dateStr: string): number => {
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.max(0, Math.round(diff / dayInMs))
}

type StorageSuggestionHintProps = {
    isLoading: boolean
    suggestion: StorageSuggestion | null
    suggestionFailed: boolean
    currentStorage: StorageLocation
    onSelectRecommended: () => void
    onApplyExpiry: () => void
    onRetry: () => void
    onRefresh: () => void
}

export const StorageSuggestionHint = ({
    isLoading,
    suggestion,
    suggestionFailed,
    currentStorage,
    onSelectRecommended,
    onApplyExpiry,
    onRetry,
    onRefresh
}: StorageSuggestionHintProps) => {
    const isMatch = suggestion
        ? currentStorage === suggestion.suggestedStorage
        : false
    const current = suggestion?.expiryByStorage[currentStorage]
    const recommended = suggestion
        ? suggestion.expiryByStorage[suggestion.suggestedStorage]
        : undefined

    return (
        <div className={'rounded-lg border border-soft-green-border bg-soft-green-bg p-3.5'}>
            <div className={'flex items-center gap-1.75'}>
                <SparklesIcon
                    size={14}
                    className={'text-green'}
                />
                <span className={'font-bold text-caption text-green'}>
                    {pantryTexts.addForm.suggestionTitle}
                </span>
                {isLoading && (
                    <span className={'size-3.25 animate-spin rounded-full border-2 border-soft-green-border border-t-green'}/>
                )}
                {suggestion && !isLoading && (
                    <IconButton
                        aria-label={pantryTexts.addForm.suggestionRefresh}
                        title={pantryTexts.addForm.suggestionRefresh}
                        onClick={onRefresh}
                        className={'ms-auto size-6 text-green'}
                    >
                        <RefreshCwIcon size={13}/>
                    </IconButton>
                )}
            </div>
            {suggestionFailed && !isLoading && (
                <div className={'mt-2 flex items-center justify-between gap-2.5'}>
                    <span className={'text-caption text-ink-3'}>
                        {pantryTexts.addForm.suggestionError}
                    </span>
                    <SecondaryButton
                        onClick={onRetry}
                        className={'h-auto shrink-0 border-soft-green-border px-3.5 py-2 text-caption'}
                    >
                        {pantryTexts.addForm.suggestionRetry}
                    </SecondaryButton>
                </div>
            )}
            {suggestion && !suggestion.recognized && !isLoading && (
                <p className={'mt-2 text-caption text-ink-3'}>
                    {pantryTexts.addForm.suggestionNotRecognized}
                </p>
            )}
            {suggestion && suggestion.recognized && current && (
                <div className={'mt-2 flex flex-col gap-2.5'}>
                    {isMatch ? (
                        <div className={'flex items-start gap-2.25 pb-2.5'}>
                            <CheckIcon
                                size={13}
                                className={'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green text-surface'}
                            />
                            <div className={'min-w-0'}>
                                <div className={'font-bold text-label text-ink'}>
                                    {pantryTexts.addForm.suggestionMatchTitle(pantryTexts.storageLabels[suggestion.suggestedStorage])}
                                </div>
                                <div className={'mt-0.5 text-caption text-ink-green'}>
                                    {recommended?.reason}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={'flex flex-col gap-2.25 pb-2.5'}>
                            <div className={'flex items-center justify-between gap-2.5'}>
                                <span className={'font-bold text-label text-ink'}>
                                    {pantryTexts.addForm.suggestionMismatchTitle(pantryTexts.storageLabels[suggestion.suggestedStorage])}
                                </span>
                                <SecondaryButton
                                    onClick={onSelectRecommended}
                                    className={'h-auto shrink-0 border-soft-green-border px-3.5 py-2 text-caption'}
                                >
                                    {pantryTexts.addForm.selectRecommended}
                                </SecondaryButton>
                            </div>
                            <div className={'rounded-md border border-warning-border bg-warning-bg p-2.25'}>
                                <div className={'font-bold text-caption text-warning-fg'}>
                                    {pantryTexts.addForm.currentOptionLabel(pantryTexts.storageLabels[currentStorage])}
                                </div>
                                <div className={'mt-0.5 text-caption text-ink-3'}>
                                    {current.reason}
                                </div>
                            </div>
                            <div className={'rounded-md border border-soft-green-border bg-surface p-2.25'}>
                                <div className={'font-bold text-caption text-green'}>
                                    {pantryTexts.addForm.recommendedOptionLabel(pantryTexts.storageLabels[suggestion.suggestedStorage])}
                                </div>
                                <div className={'mt-0.5 text-caption text-ink-green'}>
                                    {recommended?.reason}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={'h-px bg-soft-green-border'}/>
                    <div className={'flex items-center justify-between gap-2.5 pt-1'}>
                        <div className={'min-w-0'}>
                            <div className={'font-bold text-label text-ink'}>
                                {pantryTexts.addForm.expiryEstimateTitle(pantryTexts.storageLabels[currentStorage], daysUntil(current.date))}
                            </div>
                            <div className={'mt-0.5 text-caption text-ink-green'}>
                                {current.reason}
                            </div>
                        </div>
                        <PrimaryButton
                            onClick={onApplyExpiry}
                            className={'h-auto shrink-0 bg-green px-3.5 py-2 text-caption text-surface hover:bg-green/90'}
                        >
                            {pantryTexts.addForm.applyExpiry}
                        </PrimaryButton>
                    </div>
                </div>
            )}
        </div>
    )
}
