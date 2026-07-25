import Link from 'next/link'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

export const RecipeLibraryEmptyState = () => (
    <div className={'flex flex-col items-center gap-4 rounded-lg border border-border bg-surface py-16 text-center'}>
        <span className={'text-4xl'}>
            {'🍽️'}
        </span>
        <div>
            <div className={'text-heading font-bold text-ink'}>
                {recipesTexts.library.emptyTitle}
            </div>
            <div className={'mt-1 text-body text-ink-3'}>
                {recipesTexts.library.emptySub}
            </div>
        </div>
        <Button asChild>
            <Link href={routes.generate}>
                {recipesTexts.library.generateCta}
            </Link>
        </Button>
    </div>
)
