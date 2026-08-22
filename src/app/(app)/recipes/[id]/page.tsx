import { notFound } from 'next/navigation'

import { RecipeDetailView } from '@/components/recipes/detail/recipe-detail-view'

import { getRecipeById } from '@/actions/recipes/get-recipe-by-id'

type RecipeDetailPageProps = {
    params: Promise<{ id: string }>
}

const RecipeDetailPage = async ({ params }: RecipeDetailPageProps) => {
    const { id } = await params
    const recipe = await getRecipeById(id)

    if (!recipe) notFound()

    return <RecipeDetailView recipe={recipe}/>
}

export default RecipeDetailPage
