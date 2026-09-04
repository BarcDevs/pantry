import type { GenerateRecipeInput } from '@/types/recipe'
import type { RecipePromptUserContext } from '@/types/user'

export const buildGenerateRecipePrompt = (
    input: GenerateRecipeInput,
    pantryItemNames: string[],
    userContext: RecipePromptUserContext
): string => `
    צור מתכון בעברית עבור ${input.mealCount} מנות, זמן הכנה כולל
    עד ${input.maxTime} דקות, לארוחת ${input.mealType}.
    מצב התאמה למזווה: ${input.scope}.
    רמת דיוק התאמה למלאי: ${input.matchStrictness}.
    ${input.allowAiGeneration
        ? 'ניתן להשלים מרכיבים שאינם במזווה.'
        : 'אין להמציא מרכיבים שאינם מופיעים במזווה או בחיפוש רשת.'}
    פריטים זמינים במזווה: ${pantryItemNames.join(', ') || 'אין פריטים'}.
    ${userContext.cookingLevel
        ? `רמת בישול של המשתמש: ${userContext.cookingLevel}.`
        : ''}
    ${userContext.householdSize
        ? `גודל משק הבית: ${userContext.householdSize}.`
        : ''}
    ${userContext.dietaryPreferences?.length
        ? `העדפות תזונתיות: ${userContext.dietaryPreferences.join(', ')}.`
        : ''}
    ${input.customInstructions
        ? `הוראות מיוחדות נוספות מהמשתמש: ${input.customInstructions}`
        : ''}
    לכל מרכיב ציין אם הוא נמצא במזווה (inPantry).
    בחר אימוג'י יחיד המייצג את המתכון.
`
