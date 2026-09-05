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
    Eggs: 'eggs',
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

export const MealType = {
    Breakfast: 'breakfast',
    Lunch: 'lunch',
    Dinner: 'dinner',
    Snack: 'snack'
} as const
export type MealType = typeof MealType[keyof typeof MealType]
export const MEAL_TYPES = Object.values(MealType)

export const RecipeScope = {
    PantryOnly: 'pantry-only',
    PantryFirst: 'pantry-first',
    Open: 'open'
} as const
export type RecipeScope = typeof RecipeScope[keyof typeof RecipeScope]
export const RECIPE_SCOPES = Object.values(RecipeScope)

export const MatchStrictness = {
    Strict: 'strict',
    Flexible: 'flexible'
} as const
export type MatchStrictness = typeof MatchStrictness[keyof typeof MatchStrictness]
export const MATCH_STRICTNESSES = Object.values(MatchStrictness)

export const PantryUnit = {
    Kg: 'kg',
    G: 'g',
    L: 'L',
    Ml: 'ml',
    Units: 'units'
} as const
export type PantryUnit = typeof PantryUnit[keyof typeof PantryUnit]
export const PANTRY_UNITS = Object.values(PantryUnit)

export const CookingUnit = {
    Kg: 'kg',
    G: 'g',
    L: 'L',
    Ml: 'ml',
    Units: 'units',
    Teaspoon: 'tsp',
    Tablespoon: 'tbsp',
    Cup: 'cup',
    Pinch: 'pinch',
    Handful: 'handful',
    Clove: 'clove',
    Slice: 'slice'
} as const
export type CookingUnit = typeof CookingUnit[keyof typeof CookingUnit]
export const COOKING_UNITS = Object.values(CookingUnit)
