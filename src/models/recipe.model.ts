import mongoose from 'mongoose'

import {
    DIFFICULTIES,
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES,
    RECIPE_SOURCES,
    UNITS
} from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

const recipeIngredientSchema = {
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        enum: UNITS,
        required: true
    },
    inPantry: {
        type: Boolean,
        required: true
    },
    optional: {
        type: Boolean,
        required: true,
        default: false
    }
}

const recipeStepSchema = {
    order: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    }
}

const recipeHistoryEntrySchema = {
    entryId: {
        type: String,
        required: true
    },
    cookedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        default: null,
        min: 1,
        max: 5
    }
}

const aiPromptContextSchema = new mongoose.Schema(
    {
        mealCount: {
            type: Number,
            required: true,
            min: 1
        },
        maxTime: {
            type: Number,
            required: true,
            min: 0
        },
        mealType: {
            type: String,
            enum: MEAL_TYPES,
            required: true
        },
        scope: {
            type: String,
            enum: RECIPE_SCOPES,
            required: true
        },
        allowAiGeneration: {
            type: Boolean,
            required: true
        },
        matchStrictness: {
            type: String,
            enum: MATCH_STRICTNESSES,
            required: true
        },
        customInstructions: { type: String },
        pantrySnapshot: [{ type: String }]
    },
    { _id: false }
)

const recipeSchema = new mongoose.Schema<RecipeDoc>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true
        },
        source: {
            type: String,
            enum: RECIPE_SOURCES,
            required: true
        },
        sourceUrl: { type: String },
        difficulty: {
            type: String,
            enum: DIFFICULTIES,
            required: true
        },
        maxTime: {
            type: Number,
            required: true
        },
        mealCount: {
            type: Number,
            required: true
        },
        mealType: {
            type: String,
            enum: MEAL_TYPES,
            required: true
        },
        ingredients: [recipeIngredientSchema],
        steps: [recipeStepSchema],
        emoji: { type: String },
        imageUrl: { type: String },
        rating: {
            type: Number,
            default: null
        },
        history: [recipeHistoryEntrySchema],
        isFavorite: {
            type: Boolean,
            default: false
        },
        tags: [{ type: String }],
        aiPromptContext: {
            type: aiPromptContextSchema,
            default: null
        }
    },
    { timestamps: true }
)

export const RecipeModel
    = (mongoose.models.Recipe as mongoose.Model<RecipeDoc>)
    ?? mongoose.model<RecipeDoc>('Recipe', recipeSchema)
