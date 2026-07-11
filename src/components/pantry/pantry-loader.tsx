import { PantryView } from '@/components/pantry/pantry-view'

import { getPantryItems } from '@/actions/pantry/get-pantry-items'

export const PantryLoader = async () => {
    const items = await getPantryItems()

    return <PantryView items={items}/>
}
