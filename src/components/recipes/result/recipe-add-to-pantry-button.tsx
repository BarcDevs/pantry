import Link from 'next/link'

import { PlusIcon } from '@/components/icons/plus-icon'
import { OutlinedLinkButton } from '@/components/shared/buttons/OutlinedLinkButton'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeAddToPantryButtonProps = {
    href: string
}

export const RecipeAddToPantryButton = ({
    href
}: RecipeAddToPantryButtonProps) => (
    <OutlinedLinkButton asChild>
        <Link href={href}>
            {recipesTexts.result.ingredientAddToPantryLink}
            <PlusIcon size={12}/>
        </Link>
    </OutlinedLinkButton>
)
