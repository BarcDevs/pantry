import { notFound } from 'next/navigation'

import { RateView } from '@/components/recipes/rate/rate-view'

import { getRecipeById } from '@/actions/recipes/get-recipe-by-id'

type RatePageProps = {
    params: Promise<{ id: string }>
}

const RatePage = async ({ params }: RatePageProps) => {
    const { id } = await params
    const recipe = await getRecipeById(id)
    if (!recipe) notFound()

    return <RateView recipe={recipe}/>
}

export default RatePage
