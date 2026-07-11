import { Suspense } from 'react'

import { PantryGridSkeletons } from '@/components/pantry/pantry-grid-skeletons'
import { PantryLoader } from '@/components/pantry/pantry-loader'

import { pantryTexts } from '@/constants/texts/pantry'

const PantryPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <h1 className={'mb-5 font-display text-title font-weight-title text-ink'}>
            {pantryTexts.title}
        </h1>
        <Suspense fallback={<PantryGridSkeletons/>}>
            <PantryLoader/>
        </Suspense>
    </main>
)

export default PantryPage
