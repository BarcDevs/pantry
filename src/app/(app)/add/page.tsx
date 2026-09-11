import { AddItemForm } from '@/components/pantry/add/add-item-form'
import { AddMethodLinks } from '@/components/pantry/add/add-method-links'
import { PageHeader } from '@/components/shared/PageHeader'

import { pantryTexts } from '@/constants/texts/pantry'

const AddItemPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <PageHeader title={pantryTexts.addForm.title}/>
        <p className={'mb-5.5 text-body text-ink-3'}>
            {pantryTexts.addForm.subtitle}
        </p>
        <AddMethodLinks/>
        <AddItemForm/>
    </main>
)

export default AddItemPage
