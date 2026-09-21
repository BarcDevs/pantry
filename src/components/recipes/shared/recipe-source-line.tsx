import { RecipeSource } from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import { parseHttpUrl } from '@/lib/recipes/parse-http-url'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeSourceLineProps = {
    recipe: Pick<RecipeDoc, 'source' | 'sourceUrl' | 'sourceName'>
}

const captionClassName = '-mt-2 mb-5 text-caption text-ink-3'

export const RecipeSourceLine = ({ recipe }: RecipeSourceLineProps) => {
    if (recipe.source === RecipeSource.AiGenerated) return (
        <p className={captionClassName}>
            {recipesTexts.result.sourceAi}
        </p>
    )
    if (!recipe.sourceUrl) return null

    const url = parseHttpUrl(recipe.sourceUrl)
    const name = recipe.sourceName
        || url?.hostname.replace(/^www\./, '')
    if (!name) return null

    const label = recipesTexts.result.sourceLabel(name)
    if (!url) return (
        <p className={captionClassName}>
            {label}
        </p>
    )

    return (
        <p className={captionClassName}>
            <a
                href={url.href}
                target={'_blank'}
                rel={'noopener noreferrer'}
                className={'cursor-pointer font-semibold text-ink-green underline'}
            >
                {label}
            </a>
        </p>
    )
}
