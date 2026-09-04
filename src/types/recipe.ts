import type { MongoDbObject } from '@/types'
import type {
    Difficulty,
    MatchStrictness,
    MealType,
    RecipeScope,
    RecipeSource,
    Unit
} from '@/types/enums'

export type RecipeIngredient = {
    name: string
    quantity: number
    unit: Unit
    inPantry: boolean
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
