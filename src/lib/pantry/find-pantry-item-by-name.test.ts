import { findPantryItemByName } from './find-pantry-item-by-name'

const items = [
    { _id: 'a', name: 'Milk' },
    { _id: 'b', name: 'עגבניות שרי' },
    { _id: 'c', name: 'Olive  oil' }
]

describe('findPantryItemByName', () => {
    it('matches ignoring case, punctuation and extra whitespace', () => {
        expect(findPantryItemByName(items, ' milk! ')?._id).toBe('a')
        expect(findPantryItemByName(items, 'olive oil')?._id).toBe('c')
        expect(findPantryItemByName(items, 'עגבניות  שרי')?._id).toBe('b')
    })

    it('returns undefined when nothing matches', () => {
        expect(findPantryItemByName(items, 'bread')).toBeUndefined()
        expect(findPantryItemByName([], 'milk')).toBeUndefined()
    })

    it('returns the first match when several share a name', () => {
        const duplicates = [
            { _id: 'x', name: 'Milk' },
            { _id: 'y', name: 'milk' }
        ]

        expect(findPantryItemByName(duplicates, 'MILK')?._id).toBe('x')
    })
})
