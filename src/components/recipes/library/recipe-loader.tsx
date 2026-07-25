import { RecipeLibraryView } from '@/components/recipes/library/recipe-library-view'

import { getRecipes } from '@/actions/recipes/get-recipes'

export const RecipeLoader = async () => {
    const recipes = await getRecipes()

    return <RecipeLibraryView recipes={recipes}/>
}
