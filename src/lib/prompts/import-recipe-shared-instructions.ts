export const importRecipeExtractionInstructions = `
    חלץ מהתוכן מתכון מובנה: כותרת (title), רמת קושי (difficulty: easy/medium/hard),
    סוג ארוחה (mealType: breakfast/lunch/dinner/snack), מספר מנות (mealCount),
    זמן הכנה בדקות (maxTime), אימוג'י מתאים (emoji), רשימת מצרכים (ingredients:
    name, quantity, unit - אחת מ: קילוגרם=kg, גרם=g, ליטר=L, מיליליטר=ml, יחידות=units),
    ורשימת שלבי הכנה ממוספרים (steps: order, description).
    אם פרט מסוים אינו מצוין בתוכן, הסק ניחוש סביר במקומו.
`
