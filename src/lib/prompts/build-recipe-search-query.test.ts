import { FoodType } from '@/types/enums'

import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { buildRecipeSearchQuery } from './build-recipe-search-query'

const item = (
    name: string,
    type: FoodType | null
): MinimalPantryItem => ({
    name,
    type,
    quantity: 1,
    unit: 'units'
})

describe('buildRecipeSearchQuery', () => {
    it('starts with the recipe word and the Hebrew meal type label', () => {
        expect(buildRecipeSearchQuery('dinner', [item('עוף', FoodType.Meat)]))
            .toBe('מתכון ערב עוף')
    })

    it('keeps at most 4 ingredients, preferring protein, vegetables, dairy and grains over staples', () => {
        const query = buildRecipeSearchQuery('lunch', [
            item('מלח', FoodType.Condiments),
            item('שמן', FoodType.Other),
            item('אורז', FoodType.Grains),
            item('גבינה', FoodType.Dairy),
            item('עגבניה', FoodType.Vegetables),
            item('חזה עוף', FoodType.Meat),
            item('פפריקה', null)
        ])
        expect(query).toBe('מתכון צהריים חזה עוף עגבניה גבינה אורז')
    })

    it('fills with staples when there are few main ingredients and drops duplicates', () => {
        const query = buildRecipeSearchQuery('snack', [
            item('מלח', FoodType.Condiments),
            item('בצל', FoodType.Vegetables),
            item('בצל', FoodType.Vegetables)
        ])
        expect(query).toBe('מתכון נשנוש בצל מלח')
    })

    it('is deterministic and keeps pantry order inside a category', () => {
        const items = [
            item('גזר', FoodType.Vegetables),
            item('בצל', FoodType.Vegetables)
        ]
        expect(buildRecipeSearchQuery('breakfast', items))
            .toBe(buildRecipeSearchQuery('breakfast', items))
        expect(buildRecipeSearchQuery('breakfast', items))
            .toBe('מתכון בוקר גזר בצל')
    })
})
