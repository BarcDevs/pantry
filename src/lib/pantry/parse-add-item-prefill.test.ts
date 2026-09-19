import { parseAddItemPrefill } from './parse-add-item-prefill'

describe('parseAddItemPrefill', () => {
    it('reads name, quantity and a valid unit', () => {
        expect(parseAddItemPrefill({
            name: ' עגבניות ',
            quantity: '2',
            unit: 'kg'
        })).toEqual(expect.objectContaining({
            name: 'עגבניות',
            quantity: 2,
            unit: 'kg'
        }))
    })

    it('drops the quantity when the unit is not a pantry unit', () => {
        const prefill = parseAddItemPrefill({
            name: 'מלח',
            quantity: '2',
            unit: 'tsp'
        })

        expect(prefill.unit).toBeUndefined()
        expect(prefill.quantity).toBeUndefined()
    })

    it('accepts only internal return paths', () => {
        expect(parseAddItemPrefill({ returnTo: '/generate/result' }).returnTo)
            .toBe('/generate/result')
        expect(parseAddItemPrefill({ returnTo: '//evil.com' }).returnTo)
            .toBeUndefined()
        expect(parseAddItemPrefill({ returnTo: 'https://evil.com' }).returnTo)
            .toBeUndefined()
    })
})
