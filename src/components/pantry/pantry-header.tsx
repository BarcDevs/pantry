import Link from 'next/link'

import { HistoryIcon } from '@/components/icons/history-icon'
import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

type PantryHeaderProps = {
    displayName: string
}

export const PantryHeader = ({
    displayName
}: PantryHeaderProps) => (
    <div className={'mb-5 flex items-start justify-between gap-3'}>
        <div className={'flex flex-col gap-2'}>
            <Button
                asChild
                className={'w-fit bg-ember text-surface shadow-none hover:bg-ember/90'}
            >
                <Link href={routes.generate}>
                    {pantryTexts.generateRecipe}
                </Link>
            </Button>
            <span className={'text-body text-ink-3'}>
                {pantryTexts.greeting(displayName)}
            </span>
        </div>
        <div className={'flex items-center gap-3'}>
            <div
                aria-disabled
                className={'flex size-9 items-center justify-center rounded-full border border-border-2 text-ink-4 opacity-50'}
            >
                <HistoryIcon size={18}/>
            </div>
            <h1 className={'font-display text-title font-weight-title text-ink'}>
                {pantryTexts.title}
            </h1>
        </div>
    </div>
)
