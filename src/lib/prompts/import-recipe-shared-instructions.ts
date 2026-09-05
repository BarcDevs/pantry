export const importRecipeExtractionInstructions = `
    חלץ מהתוכן מתכון מובנה: כותרת (title), רמת קושי (difficulty: easy/medium/hard),
    סוג ארוחה (mealType: breakfast/lunch/dinner/snack), מספר מנות (mealCount),
    זמן הכנה בדקות (maxTime), אימוג'י מתאים (emoji), רשימת מצרכים (ingredients:
    name, quantity, unit - אחת מ: קילוגרם=kg, גרם=g, ליטר=L, מיליליטר=ml, יחידות=units,
    כפית=tsp, כף=tbsp, כוס=cup, קורט=pinch, חופן=handful, שן (למשל שן שום)=clove,
    פרוסה=slice - השתמש ביחידת המדידה המקורית מהמתכון (למשל "2 כפות שמן" -> unit: tbsp),
    אל תמיר הכל ל-units כברירת מחדל,
    optional - האם המרכיב מסומן במקור כאופציונלי/רשות/לקישוט, כגון "עשבי תיבול
    לקישוט (רשות)" - אל תשמיט מרכיבים כאלה, כלול אותם עם optional: true),
    ורשימת שלבי הכנה ממוספרים (steps: order, description).
    אם פרט מסוים אינו מצוין בתוכן, הסק ניחוש סביר במקומו.
`
