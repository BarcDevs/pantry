export const StorageLocation = {
    Fridge: 'fridge',
    Freezer: 'freezer',
    Pantry: 'pantry'
} as const
export type StorageLocation = typeof StorageLocation[keyof typeof StorageLocation]
export const STORAGE_LOCATIONS = Object.values(StorageLocation)

export const FoodType = {
    Vegetables: 'vegetables',
    Fruits: 'fruits',
    Dairy: 'dairy',
    Meat: 'meat',
    Fish: 'fish',
    Canned: 'canned',
    Grains: 'grains',
    Snacks: 'snacks',
    Beverages: 'beverages',
    Condiments: 'condiments',
    Other: 'other'
} as const
export type FoodType = typeof FoodType[keyof typeof FoodType]
export const FOOD_TYPES = Object.values(FoodType)

export const Difficulty = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard'
} as const
export type Difficulty = typeof Difficulty[keyof typeof Difficulty]
export const DIFFICULTIES = Object.values(Difficulty)

export const RecipeSource = {
    AiGenerated: 'ai_generated',
    ImportedUrl: 'imported_url',
    Manual: 'manual'
} as const
export type RecipeSource = typeof RecipeSource[keyof typeof RecipeSource]
export const RECIPE_SOURCES = Object.values(RecipeSource)

export const ItemSource = {
    Manual: 'manual',
    ReceiptScan: 'receipt_scan',
    ReceiptUrl: 'receipt_url'
} as const
export type ItemSource = typeof ItemSource[keyof typeof ItemSource]
export const ITEM_SOURCES = Object.values(ItemSource)

export const Unit = {
    Kg: 'kg',
    G: 'g',
    L: 'L',
    Ml: 'ml',
    Units: 'units'
} as const
export type Unit = typeof Unit[keyof typeof Unit]
export const UNITS = Object.values(Unit)
