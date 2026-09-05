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
    לכל מרכיב ציין יחידת מידה (unit) התואמת לאופן שבו מבשלים בפועל
    משתמשים בה - kg, g, L, ml, units, tsp (כפית), tbsp (כף), cup (כוס),
    pinch (קורט), handful (חופן), clove (שן), slice (פרוסה). אל תמיר
    הכל ל-units כברירת מחדל - למשל מלח שנמדד בכפיות מקבל unit: tsp,
    לא unit: units.
    לכל מרכיב ציין אם הוא נמצא במזווה (inPantry).
    לכל מרכיב ציין גם אם הוא אופציונלי (optional) - כלומר תוספת,
    קישוט להגשה, או משהו שניתן להשמיט בלי לפגוע במתכון עצמו
    (למשל עשבי תיבול לקישוט, רוטב צד). מרכיבים ליבתיים למתכון
    הם optional: false.
    בחר אימוג'י יחיד המייצג את המתכון.
    כתוב את שלבי ההכנה (steps) במלואם - אסור לקצר, לסכם, או להשמיט
    כל פרט תפעולי: זמנים, טמפרטורות, כמויות, סימני מוכנות חזותיים/
    ריחניים/קוליים (למשל "עד שמתחיל לבעבע", "עד שמזהיב", "עד שהנוזל
    מצטמצם"), ופעולות ביניים כמו "לערבב מדי פעם", "לכסות", "להנמיך
    להבה". אל תמזג כמה פעולות שונות למשפט מקוצר אחד אם זה מאבד מידע -
    כל פעולה משמעותית מקבלת את הפירוט שלה. אורך הטקסט אינו שיקול -
    שלם ומדויק חשוב יותר מקצר.
    רמת הבישול של המשתמש (אם צוינה) קובעת כמה הסבר רקע/הקשר להוסיף
    (למשל להסביר טכניקה למתחיל), ולא אמורה לגרום לפישוט שפה, השמטת
    פרטים, או ניסוח כללי מדי - גם למתחיל צריך את כל הפרטים המדויקים
    שלמעלה.
`
