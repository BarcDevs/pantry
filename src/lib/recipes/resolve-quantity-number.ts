export const resolveQuantityNumber = (quantity: number | string): number => {
    if (typeof quantity === 'number') return quantity

    const parts = quantity.split('-').map(Number).filter((part) => !Number.isNaN(part))
    if (parts.length === 0) return 0

    return Math.max(...parts)
}
