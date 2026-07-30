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
    },
    result: {
        servingsLabel: 'מנות',
        stepsLabel: 'שלבים',
        pantryMatchLabel: 'מהמלאי',
        ingredientsTitle: 'מצרכים',
        stepsTitle: 'תקציר ההכנה',
        imageFieldTitle: 'תמונת המתכון',
        imageFieldOptional: '· אופציונלי',
        imageFieldDescription: 'אין תמונה אוטומטית למתכון זה. אפשר להדביק כתובת תמונה.',
        imageUrlPlaceholder: 'https://example.com/dish.jpg',
        applyImage: 'החל תמונה',
        removeImage: 'הסר תמונה',
        refineLabel: 'רוצים לשנות משהו?',
        refinePlaceholder: 'לדוגמה: הוסיפו חריפות, הפכו לצמחוני',
        refineSubmit: 'עדכון מתכון',
        refining: 'מעדכן...',
        refineError: 'עדכון המתכון נכשל, נסו שוב',
        save: 'שמירה לספרייה',
        saved: 'נשמר',
        saving: 'שומר...',
        saveError: 'שמירת המתכון נכשלה, נסו שוב',
        startCooking: 'התחל לבשל ←',
        favoriteOn: 'הסר ממועדפים',
        favoriteOff: 'הוסף למועדפים'
    },
    library: {
        title: 'המתכונים שלי',
        search: 'חיפוש מתכון...',
        filterAll: 'הכל',
        filterCooked: 'בושלו',
        filterFavorites: 'מועדפים',
        emptyTitle: 'הספרייה ריקה',
        emptySub: 'צרו מתכון חדש כדי להתחיל',
        noResults: 'לא נמצאו מתכונים תואמים',
        generateCta: 'יצירת מתכון',
        favoriteToggleError: 'עדכון המועדפים נכשל'
    },
    cook: {
        stepLabel: 'שלב',
        doneCooking: 'סיום בישול',
        previous: 'הקודם',
        next: 'הבא',
        finish: 'סיום'
    },
    deduct: {
        title: 'בתיאבון!',
        description: 'כמה השתמשתם מכל מצרך? עדכנו את הכמויות ונעדכן את המזווה בהתאם.',
        remainingLabel: 'נשארו',
        zeroWarning: 'נגמר במזווה — מה לעשות?',
        keepAtZero: 'השאר ברשימה (0)',
        deleteFromPantry: 'מחק מהמזווה',
        confirm: 'אישור ועדכון המזווה',
        skip: 'דלג — השאר את המזווה ללא שינוי',
        deductError: 'עדכון המזווה נכשל, נסו שוב',
        chooseRequired: 'יש לבחור השאר או מחק עבור פריטים שנגמרו'
    },
    rate: {
        title: 'איך יצא?',
        descriptionPrefix: 'דרגו את',
        descriptionSuffix: '— נשמור אותו בהיסטוריית הבישול שלכם.',
        ratingLabels: [
            'דרגו כדי לשמור',
            'לא יצא טוב',
            'סביר',
            'טוב',
            'טעים מאוד',
            'מושלם!'
        ],
        autoSaveNote: 'המתכון נשמר אוטומטית למתכונים שלי',
        finishWithRating: 'סיום ושמירה בהיסטוריה',
        finishWithoutRating: 'שמור להיסטוריה בלי דירוג',
        rateError: 'שמירת הדירוג נכשלה, נסו שוב'
    }
} as const
