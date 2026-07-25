import type { RecipeDoc } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeResultHeroProps = {
    recipe: RecipeDoc
}

export const RecipeResultHero = ({ recipe }: RecipeResultHeroProps) => (
    <div
        className={'relative mb-5 h-[200px] overflow-hidden rounded-2xl bg-[image:var(--gradient-brand)] bg-cover bg-center'}
        style={recipe.imageUrl ? { backgroundImage: `url(${recipe.imageUrl})` } : undefined}
    >
        {!recipe.imageUrl && (
            <div className={'absolute inset-0 flex items-center justify-center text-8xl'}>
                {recipe.emoji ?? '🍽️'}
            </div>
        )}
        <div className={'absolute inset-x-0 bottom-0 bg-linear-to-t from-black/40 to-transparent p-5'}>
            <div className={'mb-2 flex gap-2'}>
                <span className={'rounded-full bg-surface/90 px-3 py-1 text-caption font-bold text-ink'}>
                    {`⏱ ${recipe.maxTime} דק׳`}
                </span>
                <span className={'rounded-full bg-surface/90 px-3 py-1 text-caption font-bold text-ink-green'}>
                    {recipesTexts.generate.mealTypeOptions[recipe.mealType]}
                </span>
            </div>
            <div className={'font-display text-title font-weight-title text-surface'}>
                {recipe.title}
            </div>
        </div>
    </div>
)
