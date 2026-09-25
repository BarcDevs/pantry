import type { GenerateRecipeInput } from '@/types/recipe'
import type { RecipePromptUserContext } from '@/types/user'

import {
    recipePantryMatchingInstruction,
    recipeSpiceLevelInstruction,
    recipeStepsDetailInstructions,
    recipeUnitsInstructions
} from '@/lib/prompts/recipe-shared-instructions'

export const buildGenerateRecipePrompt = (
    input: GenerateRecipeInput,
    pantryItemNames: string[],
    userContext: RecipePromptUserContext
): string => `
    צור מתכון בעברית עבור ${input.mealCount} מנות, זמן הכנה כולל
    עד ${input.maxTime} דקות, לארוחת ${input.mealType}.
    מצב התאמה למזווה: ${input.scope}.
    רמת דיוק התאמה למלאי: ${input.matchStrictness}.
    ${input.maxSpiceLevel < 3
        ? `רמת החריפות של המתכון (spiceLevel) אסורה לעלות על ${input.maxSpiceLevel}
    מתוך 0-3.`
        : ''}
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
        ? `המנה המבוקשת: ${input.customInstructions}. צור מתכון למנה הזו והתאם אותו למזווה.`
        : ''}
    ${recipeUnitsInstructions}
    ${recipePantryMatchingInstruction(pantryItemNames)}
    לכל מרכיב ציין אם הוא אופציונלי (optional) - כלומר תוספת,
    קישוט להגשה, או משהו שניתן להשמיט בלי לפגוע במתכון עצמו
    (למשל עשבי תיבול לקישוט, רוטב צד). מרכיבים ליבתיים למתכון
    הם optional: false.
    בחר אימוג'י יחיד המייצג את המתכון.
    ${recipeSpiceLevelInstruction}
    ${recipeStepsDetailInstructions}
    רמת הבישול של המשתמש (אם צוינה) קובעת כמה הסבר רקע/הקשר להוסיף
    (למשל להסביר טכניקה למתחיל), ולא אמורה לגרום לפישוט שפה, השמטת
    פרטים, או ניסוח כללי מדי - גם למתחיל צריך את כל הפרטים המדויקים
    שלמעלה.
`
