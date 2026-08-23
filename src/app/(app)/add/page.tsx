import { AddItemForm } from '@/components/pantry/add/add-item-form'
import { PageHeader } from '@/components/shared/PageHeader'

import { pantryTexts } from '@/constants/texts/pantry'

const AddItemPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <PageHeader title={pantryTexts.addForm.title}/>
        <AddItemForm/>
    </main>
)

export default AddItemPage
