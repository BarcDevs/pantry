const FRACTION_GLYPHS: Array<[number, string]> = [
    [0.125, '⅛'],
    [0.2, '⅕'],
    [0.25, '¼'],
    [0.333, '⅓'],
    [0.375, '⅜'],
    [0.4, '⅖'],
    [0.5, '½'],
    [0.6, '⅗'],
    [0.625, '⅝'],
    [0.667, '⅔'],
    [0.75, '¾'],
    [0.8, '⅘'],
    [0.875, '⅞']
]

const FRACTION_TOLERANCE = 0.02

export const formatQuantity = (quantity: number | string): string => {
    if (typeof quantity === 'string') return quantity

    const whole = Math.floor(quantity)
    const fraction = quantity - whole

    if (fraction < FRACTION_TOLERANCE) return String(quantity)

    const match = FRACTION_GLYPHS.find(
        ([value]) => Math.abs(fraction - value) < FRACTION_TOLERANCE
    )
    if (!match) return String(Math.round(quantity * 100) / 100)

    const [, glyph] = match
    return whole > 0 ? `${whole}${glyph}` : glyph
}
