import type { PantryUnit } from '@/types/enums'
import { PANTRY_UNITS } from '@/types/enums'

export type AddItemPrefill = {
    name?: string
    quantity?: number
    unit?: PantryUnit
    returnTo?: string
}

type SearchParamValue = string | string[] | undefined

const firstValue = (value: SearchParamValue): string | undefined => (
    Array.isArray(value) ? value[0] : value
)

export const parseAddItemPrefill = (
    params: Record<string, SearchParamValue>
): AddItemPrefill => {
    const name = firstValue(params.name)?.trim()
    const quantity = Number(firstValue(params.quantity))
    const unit = PANTRY_UNITS.find((option) => option === firstValue(params.unit))

    const returnTo = firstValue(params.returnTo)
    const isInternalPath = !!returnTo?.startsWith('/') && !returnTo.startsWith('//')

    return {
        returnTo: isInternalPath ? returnTo : undefined,
        name: name || undefined,
        quantity: unit && quantity > 0 ? quantity : undefined,
        unit
    }
}
