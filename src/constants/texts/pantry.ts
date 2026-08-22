export const pantryTexts = {
    title: 'המזווה שלי',
    search: 'חיפוש במזווה...',
    emptyTitle: 'המזווה ריק',
    emptySub: 'הוסיפו מוצרים כדי להתחיל',
    addItem: 'הוספת מוצר',
    generateRecipe: '✦ יצירת מתכון',
    greeting: (name: string) => `היי ${name},`,
    statItemsInStock: 'פריטים במלאי',
    statExpiringSoon: 'מתקלקלים בקרוב',
    statSavedRecipes: 'מתכונים שמורים',
    filterAll: 'הכל',
    storageLabels: {
        fridge: 'מקרר',
        freezer: 'מקפיא',
        pantry: 'מזווה'
    },
    unitLabels: {
        kg: 'ק"ג',
        g: 'גרם',
        L: 'ליטר',
        ml: 'מ"ל',
        units: 'יחידות'
    },
    expiredLabel: 'פג תוקף',
    daysLeftLabel: 'ימים',
    noExpiryLabel: 'ללא תאריך',
    noResults: 'לא נמצאו מוצרים תואמים',
    foodTypeLabels: {
        vegetables: 'ירקות',
        fruits: 'פירות',
        dairy: 'מוצרי חלב',
        meat: 'בשר',
        fish: 'דגים',
        canned: 'שימורים',
        grains: 'דגנים',
        snacks: 'חטיפים',
        beverages: 'משקאות',
        condiments: 'תבלינים ורטבים',
        other: 'אחר'
    },
    addForm: {
        title: 'הוספת מוצר',
        nameLabel: 'שם המוצר',
        namePlaceholder: 'לדוגמה: קישואים',
        emojiLabel: 'סמל',
        storageLabel: 'מיקום',
        typeLabel: 'סוג מוצר',
        quantityLabel: 'כמות',
        unitLabel: 'יחידה',
        expiryLabel: 'תאריך תפוגה',
        notesLabel: 'הערות (אופציונלי)',
        submit: 'הוספה למזווה',
        submitting: 'מוסיף...',
        suggestionTitle: 'הצעת אחסון ותפוגה חכמה',
        suggestionMatchTitle: (location: string) => (
            `הבחירה שלך מומלצת לאחסון: ${location}`
        ),
        suggestionMismatchTitle: (location: string) => (
            `מומלץ לאחסון: ${location}`
        ),
        currentOptionLabel: (location: string) => (
            `הבחירה הנוכחית · ${location}`
        ),
        recommendedOptionLabel: (location: string) => (
            `ההמלצה · ${location}`
        ),
        selectRecommended: 'בחר',
        expiryEstimateTitle: (location: string, days: number) => (
            `תפוגה ב${location}: ~${days} ימים`
        ),
        applyExpiry: 'קבע תאריך',
        typeRowLabel: 'סוג מוצר',
        typeRowChange: 'שנה',
        typeRowAdd: 'הוסף סוג מוצר +',
        typePickerTitle: 'מה סוג המוצר?',
        typePickerSkip: 'דלג',
        saveError: 'שמירת המוצר נכשלה, נסו שוב'
    },
    duplicateDialog: {
        title: 'המוצר כבר קיים במזווה',
        description: 'כבר יש לכם מוצר בשם זה. תרצו למזג את הכמויות או לשמור כפריט נפרד?',
        merge: 'מיזוג כמויות',
        keepSeparate: 'שמירה כפריט נפרד'
    },
    editForm: {
        title: 'עריכת מוצר',
        submit: 'שמירת שינויים',
        submitting: 'שומר...',
        suggestButton: 'קבלת המלצת אחסון',
        suggesting: 'בודק המלצת אחסון...',
        saveError: 'שמירת השינויים נכשלה, נסו שוב',
        deleteButton: 'מחיקת מוצר',
        deleting: 'מוחק...',
        deleteError: 'מחיקת המוצר נכשלה, נסו שוב'
    },
    deleteDialog: {
        title: 'מחיקת מוצר',
        description: 'הפעולה תמחק את המוצר מהמזווה לצמיתות. לא ניתן לבטל.',
        cancel: 'ביטול',
        confirm: 'מחיקה'
    }
} as const
