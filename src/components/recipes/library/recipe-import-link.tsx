import Link from 'next/link'

import { DownloadIcon } from 'lucide-react'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

export const RecipeImportLink = () => (
    <Link
        href={routes.recipeImport}
        className={'flex shrink-0 items-center gap-1.5 text-label font-bold text-green'}
    >
        <DownloadIcon size={16}/>
        {recipesTexts.import.title}
    </Link>
)
