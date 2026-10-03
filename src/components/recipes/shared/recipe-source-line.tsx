import { RecipeSource } from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import { parseHttpUrl } from '@/lib/recipes/parse-http-url'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeSourceLineProps = {
    recipe: Pick<RecipeDoc, 'source' | 'sourceUrl' | 'sourceName'>
    /** Card context: skip the "AI-generated" label and use tighter spacing - only mentions a real web source. */
    compact?: boolean
}

const captionClassName = '-mt-2 mb-5 text-caption text-ink-3'
const compactClassName = 'mt-0.75 text-caption text-ink-3'

export const RecipeSourceLine = ({
    recipe,
    compact = false
}: RecipeSourceLineProps) => {
    const className = compact ? compactClassName : captionClassName

    if (recipe.source === RecipeSource.AiGenerated) {
        if (compact) return null
        return (
            <p className={className}>
                {recipesTexts.result.sourceAi}
            </p>
        )
    }
    if (!recipe.sourceUrl) return null

    const url = parseHttpUrl(recipe.sourceUrl)
    const name = recipe.sourceName
        || url?.hostname.replace(/^www\./, '')
    if (!name) return null

    const label = recipesTexts.result.sourceLabel(name)
    if (!url) return (
        <p className={className}>
            {label}
        </p>
    )

    /**
     * In `compact` mode this renders inside RecipeCard's own wrapping `<Link>` -
     * a real `<a>` here would nest anchors, which React/Next flags as a
     * hydration error. A span acting as a link (role, tabIndex, keyboard
     * activation) avoids that while still opening the source in a new tab.
     */
    const openSource = (e: { preventDefault: () => void, stopPropagation: () => void }) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(
            url.href,
            '_blank',
            'noopener,noreferrer'
        )
    }

    if (compact) return (
        <p className={className}>
            <span
                role={'link'}
                tabIndex={0}
                onClick={openSource}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openSource(e)
                }}
                className={'cursor-pointer font-semibold text-ink-green underline'}
            >
                {label}
            </span>
        </p>
    )

    return (
        <p className={className}>
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
