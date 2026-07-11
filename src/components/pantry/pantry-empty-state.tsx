import Link from 'next/link'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

export const PantryEmptyState = () => (
    <div className={'flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface py-16 text-center'}>
        <span className={'text-4xl'}>
            {'🧺'}
        </span>
        <div>
            <div className={'text-heading font-bold text-ink'}>
                {pantryTexts.emptyTitle}
            </div>
            <div className={'mt-1 text-body text-ink-3'}>
                {pantryTexts.emptySub}
            </div>
        </div>
        <Button
            nativeButton={false}
            render={<Link href={routes.add}/>}
        >
            {pantryTexts.addItem}
        </Button>
    </div>
)
