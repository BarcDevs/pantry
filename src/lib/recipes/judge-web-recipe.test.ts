import {
    CookingUnit,
    FoodType,
    MatchStrictness
} from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { judgeWebRecipe } from './judge-web-recipe'

const pantry: MinimalPantryItem[] = [
    {
        name: 'אורז',
        type: FoodType.Grains,
        quantity: 100,
        unit: 'g'
    }
]

const ingredient = (
    name: string,
    inPantry: boolean,
    optional = false
): RecipeDoc['ingredients'][number] => ({
    label: name,
    name,
    category: FoodType.Other,
    quantity: 1,
    unit: CookingUnit.Units,
    inPantry,
    optional
})

const recipe = (
    ingredients: RecipeDoc['ingredients'],
    maxTime = 30
): RecipeDoc => ({ maxTime, ingredients } as RecipeDoc)

const flexible = {
    maxTime: 30,
    matchStrictness: MatchStrictness.Flexible
}
const strict = {
    maxTime: 30,
    matchStrictness: MatchStrictness.Strict
}

describe('judgeWebRecipe', () => {
    it('rejects a recipe whose stated time exceeds the requested max', () => {
        expect(judgeWebRecipe(recipe([], 45), flexible, pantry)).toBe(false)
    })

    it('accepts a recipe at the max time and one with an unknown time', () => {
        expect(judgeWebRecipe(recipe([], 30), flexible, pantry)).toBe(true)
        expect(judgeWebRecipe(recipe([], 0), flexible, pantry)).toBe(true)
        expect(judgeWebRecipe(recipe([], Number.NaN), flexible, pantry)).toBe(true)
    })

    it('flexible accepts missing optional ingredients but not missing core ones', () => {
        const optionalMissing = recipe([
            ingredient('בצל', true),
            ingredient('פטרוזיליה', false, true)
        ])
        const coreMissing = recipe([
            ingredient('בצל', true),
            ingredient('חזה עוף', false)
        ])
        expect(judgeWebRecipe(optionalMissing, flexible, pantry)).toBe(true)
        expect(judgeWebRecipe(coreMissing, flexible, pantry)).toBe(false)
    })

    it('strict rejects any missing ingredient, optional included', () => {
        const optionalMissing = recipe([
            ingredient('בצל', true),
            ingredient('פטרוזיליה', false, true)
        ])
        const allPresent = recipe([
            ingredient('בצל', true),
            ingredient('פטרוזיליה', true, true)
        ])
        expect(judgeWebRecipe(optionalMissing, strict, pantry)).toBe(false)
        expect(judgeWebRecipe(allPresent, strict, pantry)).toBe(true)
    })

    it('counts a partial quantity (name in pantry, not enough) as present', () => {
        const partial = recipe([ingredient('אורז', false)])
        expect(judgeWebRecipe(partial, strict, pantry)).toBe(true)
    })

    it('treats water (resolved as available) as present', () => {
        const withWater = recipe([ingredient('מים', true)])
        expect(judgeWebRecipe(withWater, strict, pantry)).toBe(true)
    })
})
