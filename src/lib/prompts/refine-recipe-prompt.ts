import type { RecipeDoc } from '@/types/recipe'

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
    לכל מרכיב ציין אם הוא נמצא במזווה (inPantry).
    בחר אימוג'י יחיד המייצג את המתכון המעודכן.
`
