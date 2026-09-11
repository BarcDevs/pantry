import { GenerateConfigForm } from '@/components/recipes/generate/generate-config-form'
import { RecipeImportLink } from '@/components/recipes/library/recipe-import-link'
import { PageHeader } from '@/components/shared/PageHeader'

import { recipesTexts } from '@/constants/texts/recipes'

import { ensureUser } from '@/actions/users/ensure-user'

const GeneratePage = async () => {
    const user = await ensureUser()

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={recipesTexts.generate.title}/>
            <div className={'mb-5 flex items-center justify-between gap-2'}>
                <p className={'text-body text-ink-3'}>
                    {recipesTexts.generate.subtitle}
                </p>
                <RecipeImportLink/>
            </div>
            <GenerateConfigForm dietaryPreferences={user?.dietaryPreferences ?? []}/>
        </main>
    )
}

export default GeneratePage
