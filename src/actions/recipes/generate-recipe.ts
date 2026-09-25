'use server'

import { z } from 'zod'

import {
    CookingUnit,
    Difficulty,
    FoodType,
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES
} from '@/types/enums'
import type {
    AiPromptContext,
    GenerateRecipeInput,
    GenerateRecipeResult,
    RecipeDoc
} from '@/types/recipe'
import type { RecipePromptUserContext } from '@/types/user'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { buildGenerateRecipePrompt } from '@/lib/prompts/generate-recipe-prompt'
import {
    normalizeIngredientFractions,
    normalizeStepFractions
} from '@/lib/recipes/normalize-fraction-words'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { runWebSearch } from '@/lib/recipes/run-web-search'

import { PantryItemModel } from '@/models/pantry-item.model'
import { UserModel } from '@/models/user.model'
import { aiRecipeSchema } from '@/schemas/ai-recipe-schema'
import { objectIdSchema } from '@/schemas/object-id-schema'
import { spiceLevelSchema } from '@/schemas/recipe-doc-schema'

const generateRecipeSchema = z.object({
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    scope: z.enum(RECIPE_SCOPES),
    selectedItemIds: z.array(objectIdSchema).optional(),
    allowAiGeneration: z.boolean(),
    matchStrictness: z.enum(MATCH_STRICTNESSES),
    maxSpiceLevel: spiceLevelSchema,
    customInstructions: z.string().max(500).optional(),
    excludeUrls: z.array(z.string().max(2048)).max(50).optional()
})

export const generateRecipe = async (
    input: GenerateRecipeInput
): Promise<GenerateRecipeResult> => {
    const userId = await requireUserId()
    const parsedInput = generateRecipeSchema.parse(input)

    await connectDB()

    const allPantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    const pantryQuery: Record<string, unknown> = { userId }
    if (parsedInput.selectedItemIds) {
        pantryQuery._id = { $in: parsedInput.selectedItemIds }
    }
    const selectedPantryItems = parsedInput.selectedItemIds
        ? await PantryItemModel.find(pantryQuery).lean<MinimalPantryItem[]>()
        : allPantryItems
    const pantryItemNames = selectedPantryItems.map((item) => item.name)

    const aiPromptContext: AiPromptContext = {
        mealCount: parsedInput.mealCount,
        maxTime: parsedInput.maxTime,
        mealType: parsedInput.mealType,
        scope: parsedInput.scope,
        allowAiGeneration: parsedInput.allowAiGeneration,
        matchStrictness: parsedInput.matchStrictness,
        maxSpiceLevel: parsedInput.maxSpiceLevel,
        customInstructions: parsedInput.customInstructions,
        pantrySnapshot: pantryItemNames
    }

    const { recipe: webRecipe, searchAttempted } = await runWebSearch(
        {
            request: parsedInput,
            userId,
            selectedPantryItems,
            allPantryItems
        },
        () => ({
            userId,
            title: 'פלפלים ממולאים לדוגמה',
            source: 'imported_url',
            sourceUrl: 'https://example.co.il/mock-recipe',
            sourceName: 'example.co.il',
            difficulty: Difficulty.Easy,
            spiceLevel: 0,
            maxTime: parsedInput.maxTime,
            mealCount: parsedInput.mealCount,
            mealType: parsedInput.mealType,
            ingredients: resolveIngredientPantryStatus(
                selectedPantryItems.slice(0, 3).map((item) => ({
                    label: item.name,
                    category: item.type ?? FoodType.Other,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    optional: false
                })),
                allPantryItems
            ),
            steps: [
                {
                    order: 1,
                    description: 'ממלאים את הפלפלים'
                },
                {
                    order: 2,
                    description: 'אופים 40 דקות'
                }
            ],
            emoji: '🫑',
            rating: null,
            history: [],
            isFavorite: false,
            tags: [],
            aiPromptContext: null
        })
    )
    if (webRecipe) return {
        status: 'found',
        recipe: {
            ...webRecipe,
            aiPromptContext
        }
    }
    if (!parsedInput.allowAiGeneration) return {
        status: 'no-match',
        reason: searchAttempted ? 'not-found' : 'search-unavailable'
    }

    const user = await UserModel
        .findById(userId)
        .lean<RecipePromptUserContext | null>()

    const prompt = buildGenerateRecipePrompt(parsedInput, pantryItemNames, {
        cookingLevel: user?.cookingLevel,
        householdSize: user?.householdSize,
        dietaryPreferences: user?.dietaryPreferences ?? []
    })

    const generated = await generateStructured(prompt, aiRecipeSchema, () => ({
        title: 'שקשוקה למבחן',
        difficulty: Difficulty.Easy,
        spiceLevel: 0 as const,
        emoji: '🍳',
        ingredients: selectedPantryItems.slice(0, 3).map((item) => ({
            label: item.name,
            category: item.type ?? FoodType.Other,
            quantity: 1,
            unit: CookingUnit.Units,
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

    const recipe: RecipeDoc = {
        userId,
        title: generated.title,
        source: 'ai_generated',
        difficulty: generated.difficulty,
        spiceLevel: generated.spiceLevel,
        maxTime: parsedInput.maxTime,
        mealCount: parsedInput.mealCount,
        mealType: parsedInput.mealType,
        ingredients: resolveIngredientPantryStatus(
            normalizeIngredientFractions(generated.ingredients),
            allPantryItems
        ),
        steps: normalizeStepFractions(generated.steps),
        emoji: generated.emoji,
        rating: null,
        history: [],
        isFavorite: false,
        tags: [],
        aiPromptContext
    }

    return {
        status: 'found',
        recipe
    }
}
