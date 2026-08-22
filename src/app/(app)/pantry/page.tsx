import { Suspense } from 'react'

import { PantryGridSkeletons } from '@/components/pantry/pantry-grid-skeletons'
import { PantryLoader } from '@/components/pantry/pantry-loader'

const PantryPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <Suspense fallback={<PantryGridSkeletons/>}>
            <PantryLoader/>
        </Suspense>
    </main>
)

export default PantryPage
