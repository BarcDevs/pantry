import { GenerateConfigForm } from '@/components/recipes/generate/generate-config-form'
import { PageHeader } from '@/components/shared/PageHeader'

import { recipesTexts } from '@/constants/texts/recipes'

import { ensureUser } from '@/actions/users/ensure-user'

const GeneratePage = async () => {
    const user = await ensureUser()

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={recipesTexts.generate.title}/>
            <p className={'mb-5 text-body text-ink-3'}>
                {recipesTexts.generate.subtitle}
            </p>
            <GenerateConfigForm dietaryPreferences={user?.dietaryPreferences ?? []}/>
        </main>
    )
}

export default GeneratePage
