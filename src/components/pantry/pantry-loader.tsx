import { PantryView } from '@/components/pantry/pantry-view'

import { getPantryItems } from '@/actions/pantry/get-pantry-items'
import { getRecipes } from '@/actions/recipes/get-recipes'
import { ensureUser } from '@/actions/users/ensure-user'

export const PantryLoader = async () => {
    const [items, recipes, user] = await Promise.all([
        getPantryItems(),
        getRecipes(),
        ensureUser()
    ])

    return (
        <PantryView
            items={items}
            savedRecipesCount={recipes.length}
            hasCookingHistory={recipes.some((recipe) => recipe.history.length > 0)}
            displayName={user?.displayName ?? ''}
        />
    )
}
