/**
 * @jest-environment node
 */
import { PantryItemModel } from '../pantry-item.model'

describe('PantryItemModel schema', () => {
    it('defines required paths', () => {
        const { schema } = PantryItemModel
        expect(schema.path('userId')).toBeDefined()
        expect(schema.path('name')).toBeDefined()
        expect(schema.path('storage')).toBeDefined()
        expect(schema.path('quantity')).toBeDefined()
        expect(schema.path('unit')).toBeDefined()
    })

    it('source defaults to manual', () => {
        const item = new PantryItemModel({
            userId: 'u1',
            name: 'milk',
            storage: 'fridge',
            type: 'dairy',
            quantity: 1,
            unit: 'L'
        })
        expect(item.source).toBe('manual')
    })

    it('storageSuggestion defaults to null', () => {
        const item = new PantryItemModel({
            userId: 'u1',
            name: 'milk',
            storage: 'fridge',
            type: 'dairy',
            quantity: 1,
            unit: 'L'
        })
        expect(item.storageSuggestion).toBeNull()
    })
})
