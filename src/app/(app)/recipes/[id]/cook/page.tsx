import { notFound } from 'next/navigation'

import { CookingModeView } from '@/components/recipes/cook/cooking-mode-view'

import { getRecipeById } from '@/actions/recipes/get-recipe-by-id'

type CookPageProps = {
    params: Promise<{ id: string }>
}

const CookPage = async ({ params }: CookPageProps) => {
    const { id } = await params
    const recipe = await getRecipeById(id)
    if (!recipe || recipe.steps.length === 0) notFound()

    return <CookingModeView recipe={recipe}/>
}

export default CookPage
