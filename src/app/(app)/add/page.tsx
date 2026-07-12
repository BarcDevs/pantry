import { AddItemForm } from '@/components/pantry/add/add-item-form'

import { pantryTexts } from '@/constants/texts/pantry'

const AddItemPage = () => (
    <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
        <h1 className={'mb-5 font-display text-title font-weight-title text-ink'}>
            {pantryTexts.addForm.title}
        </h1>
        <AddItemForm/>
    </main>
)

export default AddItemPage
