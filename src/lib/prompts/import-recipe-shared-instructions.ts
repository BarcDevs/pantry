import {
    recipeStepsDetailInstructions,
    recipeUnitsInstructions
} from '@/lib/prompts/recipe-shared-instructions'

export const importRecipeExtractionInstructions = `
    חלץ מהתוכן מתכון מובנה: כותרת (title), רמת קושי (difficulty: easy/medium/hard),
    סוג ארוחה (mealType: breakfast/lunch/dinner/snack), מספר מנות (mealCount),
    זמן הכנה בדקות (maxTime), אימוג'י מתאים (emoji), רשימת מצרכים (ingredients:
    name, quantity, unit,
    optional - האם המרכיב מסומן במקור כאופציונלי/רשות/לקישוט, כגון "עשבי תיבול
    לקישוט (רשות)" - אל תשמיט מרכיבים כאלה, כלול אותם עם optional: true),
    ורשימת שלבי הכנה ממוספרים (steps: order, description).
    ${recipeUnitsInstructions}
    ${recipeStepsDetailInstructions}
    אם התוכן המקורי אינו בעברית, תרגם הכל לעברית - כולל את הכותרת
    (title) עצמה, לא רק את המרכיבים והשלבים. אל תשאיר את הכותרת בשפת
    המקור.
    אם פרט מסוים אינו מצוין בתוכן, הסק ניחוש סביר במקומו.
`
