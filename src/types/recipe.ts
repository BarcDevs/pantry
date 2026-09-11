import type { MongoDbObject } from '@/types'
import type {
    CookingUnit,
    Difficulty,
    FoodType,
    MatchStrictness,
    MealType,
    RecipeScope,
    RecipeSource
} from '@/types/enums'

export type RecipeIngredient = {
    /** Free-text display form shown in the recipe (AI-written, can include prep detail like "chopped"). */
    label: string
    /** Canonical identity used for pantry matching - always code-derived from label, never AI-supplied. */
    name: string
    category: FoodType
    quantity: number | string
    unit: CookingUnit
    /** Always computed deterministically against the current pantry on every read - never AI-supplied or trusted from storage. */
    inPantry: boolean
    optional: boolean
    replacementName?: string
}

export type RecipeStep = {
    order: number
    description: string
}

export type RecipeHistoryEntry = {
    entryId: string
    cookedAt: Date
    rating: number | null
}

export type AiPromptContext = {
    mealCount: number
    maxTime: number
    mealType: MealType
    scope: RecipeScope
    allowAiGeneration: boolean
    matchStrictness: MatchStrictness
    customInstructions?: string
    pantrySnapshot: string[]
}

export type RecipeDoc = {
    userId: string
    title: string
    source: RecipeSource
    sourceUrl?: string
    difficulty: Difficulty
    maxTime: number
    mealCount: number
    mealType: MealType
    ingredients: RecipeIngredient[]
    steps: RecipeStep[]
    emoji?: string
    imageUrl?: string
    rating: number | null
    history: RecipeHistoryEntry[]
    isFavorite: boolean
    tags: string[]
    aiPromptContext: AiPromptContext | null
}

export type Recipe = RecipeDoc & MongoDbObject

export type RecipeLibraryFilter = 'all' | 'can-cook' | 'favorites'

export type RecipeSortOption = 'recent' | 'rating' | 'title'

export type RefineRecipeInput = {
    recipe: RecipeDoc
    instruction: string
}

export type UpdateRecipeInput = Partial<{
    title: string
    isFavorite: boolean
    tags: string[]
    ingredients: RecipeIngredient[]
    steps: RecipeStep[]
    imageUrl: string
}>

export type RecipeImportResult = {
    recipe: RecipeDoc | null
    fallbackToManual: boolean
}

export type GenerateRecipeInput = {
    mealCount: number
    maxTime: number
    mealType: MealType
    scope: RecipeScope
    selectedItemIds?: string[]
    allowAiGeneration: boolean
    matchStrictness: MatchStrictness
    customInstructions?: string
}
