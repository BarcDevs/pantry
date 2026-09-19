import { AddItemForm } from '@/components/pantry/add/add-item-form'
import { AddMethodLinks } from '@/components/pantry/add/add-method-links'
import { PageHeader } from '@/components/shared/PageHeader'

import { parseAddItemPrefill } from '@/lib/pantry/parse-add-item-prefill'

import { pantryTexts } from '@/constants/texts/pantry'

type AddItemPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const AddItemPage = async ({ searchParams }: AddItemPageProps) => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <PageHeader title={pantryTexts.addForm.title}/>
        <p className={'mb-5.5 text-body text-ink-3'}>
            {pantryTexts.addForm.subtitle}
        </p>
        <AddMethodLinks/>
        <AddItemForm prefill={parseAddItemPrefill(await searchParams)}/>
    </main>
)

export default AddItemPage
