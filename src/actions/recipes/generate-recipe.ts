'use server'

import { z } from 'zod'

import {
    COOKING_UNITS,
    CookingUnit,
    DIFFICULTIES,
    Difficulty,
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES
} from '@/types/enums'
import type {
    GenerateRecipeInput,
    RecipeDoc
} from '@/types/recipe'
import type { RecipePromptUserContext } from '@/types/user'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { objectIdSchema } from '@/lib/object-id-schema'
import { buildGenerateRecipePrompt } from '@/lib/prompts/generate-recipe-prompt'
import { normalizeStepFractions } from '@/lib/recipes/normalize-fraction-words'
import { quantitySchema } from '@/lib/recipes/recipe-doc-schema'

import { PantryItemModel } from '@/models/pantry-item.model'
import { UserModel } from '@/models/user.model'

const generateRecipeSchema = z.object({
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    scope: z.enum(RECIPE_SCOPES),
    selectedItemIds: z.array(objectIdSchema).optional(),
    allowAiGeneration: z.boolean(),
    matchStrictness: z.enum(MATCH_STRICTNESSES),
    customInstructions: z.string().max(500).optional()
})

const aiRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    emoji: z.string(),
    ingredients: z.array(z.object({
        name: z.string(),
        quantity: quantitySchema,
        unit: z.enum(COOKING_UNITS),
        inPantry: z.boolean(),
        optional: z.boolean().default(false)
    })),
    steps: z.array(z.object({
        order: z.number(),
        description: z.string()
    }))
})

export const generateRecipe = async (
    input: GenerateRecipeInput
): Promise<RecipeDoc> => {
    const userId = await requireUserId()
    const parsedInput = generateRecipeSchema.parse(input)

    await connectDB()

    const pantryQuery: Record<string, unknown> = { userId }
    if (parsedInput.selectedItemIds) {
        pantryQuery._id = { $in: parsedInput.selectedItemIds }
    }
    const pantryItems = await PantryItemModel
        .find(pantryQuery)
        .lean<Array<{ name: string }>>()
    const pantryItemNames = pantryItems.map((item) => item.name)

    const user = await UserModel
        .findOne({ clerkId: userId })
        .lean<RecipePromptUserContext | null>()

    const prompt = buildGenerateRecipePrompt(parsedInput, pantryItemNames, {
        cookingLevel: user?.cookingLevel,
        householdSize: user?.householdSize,
        dietaryPreferences: user?.dietaryPreferences ?? []
    })

    const generated = await generateStructured(prompt, aiRecipeSchema, () => ({
        title: 'שקשוקה למבחן',
        difficulty: Difficulty.Easy,
        emoji: '🍳',
        ingredients: pantryItemNames.slice(0, 3).map((name) => ({
            name,
            quantity: 1,
            unit: CookingUnit.Units,
            inPantry: true,
            optional: false
        })),
        steps: [
            {
                order: 1,
                description: 'מחממים מחבת'
            },
            {
                order: 2,
                description: 'מוסיפים את כל המצרכים ומבשלים'
            }
        ]
    }))

    return {
        userId,
        title: generated.title,
        source: 'ai_generated',
        difficulty: generated.difficulty,
        maxTime: parsedInput.maxTime,
        mealCount: parsedInput.mealCount,
        mealType: parsedInput.mealType,
        ingredients: generated.ingredients.map((ingredient) => ({
            ...ingredient,
            inPantry: pantryItemNames.includes(ingredient.name)
        })),
        steps: normalizeStepFractions(generated.steps),
        emoji: generated.emoji,
        rating: null,
        history: [],
        isFavorite: false,
        tags: [],
        aiPromptContext: {
            mealCount: parsedInput.mealCount,
            maxTime: parsedInput.maxTime,
            mealType: parsedInput.mealType,
            scope: parsedInput.scope,
            allowAiGeneration: parsedInput.allowAiGeneration,
            matchStrictness: parsedInput.matchStrictness,
            customInstructions: parsedInput.customInstructions,
            pantrySnapshot: pantryItemNames
        }
    }
}
