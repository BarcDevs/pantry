import type { RecipeDoc } from '@/types/recipe'

import {
    recipeStepsDetailInstructions,
    recipeUnitsInstructions
} from '@/lib/prompts/recipe-shared-instructions'

export const buildRefineRecipePrompt = (
    recipe: RecipeDoc,
    instruction: string
): string => `
    להלן מתכון קיים בעברית בפורמט JSON:
    ${JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps
    })}
    עדכן את המתכון לפי ההוראה הבאה מהמשתמש: "${instruction}".
    שמור על מספר המנות ועל זמן ההכנה הכולל ככל האפשר,
    אלא אם ההוראה דורשת אחרת.
    לכל מרכיב ציין אם הוא נמצא במזווה (inPantry) ואם הוא אופציונלי
    (optional) - שמור על הסימון הקיים של כל מרכיב אלא אם ההוראה
    משנה אותו במפורש.
    לכל מרכיב יש גם שדה baseName (שם הבסיס להתאמה מול המזווה, ללא
    תוספות הכנה כמו קצוץ/פרוס/טחון) - שמור עליו כפי שהוא במרכיבים
    שלא שינית, ועבור מרכיבים חדשים או ששונו קבע baseName מתאים לפי
    אותו עיקרון.
    לכל מרכיב יש גם שדה category (קטגוריית מזון - vegetables/fruits/
    dairy/eggs/meat/fish/canned/grains/snacks/beverages/condiments/
    other) - שמור עליו כפי שהוא במרכיבים שלא שינית, ועבור מרכיבים
    חדשים או ששונו קבע category מתאימה מבחינה קולינרית.
    שמור על יחידת המידה (unit) המקורית של כל מרכיב שלא שינית.
    ${recipeUnitsInstructions}
    בחר אימוג'י יחיד המייצג את המתכון המעודכן.
    ${recipeStepsDetailInstructions}
    זה חל גם על שלבים שלא נגעת בהם ישירות - אל תסכם אותם מחדש בקיצור.
`
