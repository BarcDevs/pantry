export const receiptItemExtractionInstructions = `
    עבור כל פריט, החזר name (שם המוצר בעברית), quantity (כמות מספרית),
    ו-unit (אחת מ: קילוגרם=kg, גרם=g, ליטר=L, מיליליטר=ml, יחידות=units).
    אם הכמות אינה מצוינת, הנח quantity: 1, unit: units.
    התעלם מפריטים שאינם מזון (למשל שקיות, החזרים, הנחות, דמי משלוח).
`
