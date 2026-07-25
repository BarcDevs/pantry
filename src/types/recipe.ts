import type { MongoDbObject } from '@/types'
import type {
    Difficulty,
    MatchStrictness,
    MealType,
    RecipeScope,
    RecipeSource
} from '@/types/enums'

export type RecipeIngredient = {
    name: string
    quantity: number
    unit: string
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
