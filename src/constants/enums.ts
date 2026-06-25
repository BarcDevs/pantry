export type StorageLocation = 'fridge' | 'freezer' | 'pantry'

export type FoodType =
    | 'vegetables'
    | 'fruits'
    | 'dairy'
    | 'meat'
    | 'fish'
    | 'canned'
    | 'grains'
    | 'snacks'
    | 'beverages'
    | 'condiments'
    | 'other'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type RecipeSource = 'ai_generated' | 'imported_url' | 'manual'

export type ItemSource = 'manual' | 'receipt_scan' | 'receipt_url'

export type Unit = 'kg' | 'g' | 'L' | 'ml' | 'units'
