import Link from 'next/link'

import { HistoryIcon } from '@/components/icons/history-icon'
import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

type PantryHeaderProps = {
    displayName: string
    hasCookingHistory: boolean
}

export const PantryHeader = ({
    displayName,
    hasCookingHistory
}: PantryHeaderProps) => (
    <div className={'mb-5 flex items-start justify-between gap-3'}>
        <div className={'flex flex-col items-end gap-1'}>
            <span className={'text-body text-ink-3'}>
                {`${pantryTexts.greetingPrefix} `}
                <bdi>
                    {displayName}
                </bdi>
            </span>
            <h1 className={'font-display text-title font-weight-title text-ink'}>
                {pantryTexts.title}
            </h1>
        </div>
        <div className={'flex shrink-0 items-center gap-2.5'}>
            {hasCookingHistory
                ? (
                    <Link
                        href={routes.history}
                        className={'flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink-2'}
                    >
                        <HistoryIcon size={21}/>
                    </Link>
                )
                : (
                    <div
                        aria-disabled
                        className={'flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink-2 opacity-50'}
                    >
                        <HistoryIcon size={21}/>
                    </div>
                )}
            <Button
                asChild
                className={'h-11 w-fit shrink-0 bg-ember text-surface shadow-button-ember hover:bg-ember/90'}
            >
                <Link href={routes.generate}>
                    {pantryTexts.generateRecipe}
                </Link>
            </Button>
        </div>
    </div>
)
