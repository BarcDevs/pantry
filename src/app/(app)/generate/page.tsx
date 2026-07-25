import { GenerateConfigForm } from '@/components/recipes/generate/generate-config-form'

import { recipesTexts } from '@/constants/texts/recipes'

const GeneratePage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <h1 className={'mb-5 font-display text-title font-weight-title text-ink'}>
            {recipesTexts.generate.title}
        </h1>
        <GenerateConfigForm/>
    </main>
)

export default GeneratePage
