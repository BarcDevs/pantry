import { Suspense } from 'react'

import { RecipeGridSkeletons } from '@/components/recipes/library/recipe-grid-skeletons'
import { RecipeLoader } from '@/components/recipes/library/recipe-loader'

import { recipesTexts } from '@/constants/texts/recipes'

const RecipesPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <h1 className={'mb-5 font-display text-title font-weight-title text-ink'}>
            {recipesTexts.library.title}
        </h1>
        <Suspense fallback={<RecipeGridSkeletons/>}>
            <RecipeLoader/>
        </Suspense>
    </main>
)

export default RecipesPage
