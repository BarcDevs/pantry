import Link from 'next/link'

import { PlusIcon } from '@/components/icons/plus-icon'
import { Button } from '@/components/shared/buttons/Button'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeAddToPantryButtonProps = {
    href: string
}

export const RecipeAddToPantryButton = ({
    href
}: RecipeAddToPantryButtonProps) => (
    <Button
        asChild
        variant={'ghost'}
        size={'xs'}
        className={'h-auto border border-green px-2.5 py-1 text-caption font-semibold text-green'}
    >
        <Link href={href}>
            {recipesTexts.result.ingredientAddToPantryLink}
            <PlusIcon size={12}/>
        </Link>
    </Button>
)
