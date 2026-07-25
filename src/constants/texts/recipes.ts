export const recipesTexts = {
    generate: {
        title: 'יצירת מתכון',
        mealCountLabel: 'מספר מנות',
        maxTimeLabel: 'זמן הכנה מקסימלי',
        mealTypeLabel: 'סוג ארוחה',
        mealTypeOptions: {
            breakfast: 'בוקר',
            lunch: 'צהריים',
            dinner: 'ערב',
            snack: 'נשנוש'
        },
        scopeLabel: 'התאמה למזווה',
        scopeOptions: {
            'pantry-only': 'רק מהמזווה',
            'pantry-first': 'בעיקר מהמזווה',
            open: 'פתוח'
        },
        allowAiGenerationLabel: 'השלמת מרכיבים חסרים',
        allowAiGenerationOptions: {
            true: 'מותר',
            false: 'רק ממה שיש'
        },
        matchStrictnessLabel: 'רמת דיוק התאמה',
        matchStrictnessOptions: {
            strict: 'מדויק',
            flexible: 'גמיש'
        },
        customInstructionsLabel: 'הוראות מיוחדות (אופציונלי)',
        customInstructionsPlaceholder: 'לדוגמה: ללא גלוטן, בלי בצל',
        pantrySelectionTitle: 'פריטים מהמזווה',
        pantrySelectionCount: 'נבחרו',
        pantrySelectionEdit: 'עריכת בחירה',
        sparsePantryWarning: 'פחות מ-5 פריטים נבחרו — המתכון עלול להיות פחות מגוון',
        expiredGateTitle: 'חלק מהפריטים שנבחרו פגי תוקף',
        expiredGateDescription: 'הסירו אותם מהבחירה או המשיכו בכל זאת',
        expiredGateContinue: 'המשך בכל זאת',
        expiredGateRemove: 'הסרת פגי תוקף',
        submit: '✦ צור מתכון',
        submitting: 'יוצר מתכון...',
        generateError: 'יצירת המתכון נכשלה, נסו שוב',
        pantryLoadError: 'טעינת המזווה נכשלה'
    },
    pantrySheet: {
        title: 'בחירת פריטים מהמזווה',
        selectAll: 'בחירת הכל',
        clearAll: 'ניקוי בחירה',
        done: 'סיום'
    }
} as const
