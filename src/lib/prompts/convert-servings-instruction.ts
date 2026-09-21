export const buildConvertServingsInstruction = (
    mealCount: number
): string => `
    התאם את המתכון ל-${mealCount} מנות: עדכן את כמויות המרכיבים
    וכל כמות המוזכרת בשלבי ההכנה בהתאם, ושמור על כל השאר
    (שם המתכון, המרכיבים, סדר השלבים, הניסוח והסימון האופציונלי) כפי שהוא.
`
