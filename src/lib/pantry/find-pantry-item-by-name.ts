import { normalizeName } from '@/lib/normalize-name'

export const findPantryItemByName = <T extends { name: string }>(
    items: T[],
    name: string
): T | undefined => {
    const normalizedName = normalizeName(name)

    return items.find((item) => normalizeName(item.name) === normalizedName)
}
