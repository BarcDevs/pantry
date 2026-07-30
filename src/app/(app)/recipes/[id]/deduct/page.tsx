import { notFound } from 'next/navigation'

import { DeductView } from '@/components/recipes/deduct/deduct-view'

import { getPantryItems } from '@/actions/pantry/get-pantry-items'
import { getRecipeById } from '@/actions/recipes/get-recipe-by-id'

type DeductPageProps = {
    params: Promise<{ id: string }>
}

const DeductPage = async ({ params }: DeductPageProps) => {
    const { id } = await params
    const [recipe, pantryItems] = await Promise.all([
        getRecipeById(id),
        getPantryItems()
    ])
    if (!recipe) notFound()

    return (
        <DeductView
            recipe={recipe}
            pantryItems={pantryItems}
        />
    )
}

export default DeductPage
