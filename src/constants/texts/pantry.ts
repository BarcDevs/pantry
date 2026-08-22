export const pantryTexts = {
    title: 'המזווה שלי',
    search: 'חיפוש במזווה...',
    emptyTitle: 'המזווה ריק',
    emptySub: 'הוסיפו מוצרים כדי להתחיל',
    addItem: 'הוספת מוצר',
    generateRecipe: 'יצירת מתכון',
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
        namePlaceholder: 'לדוגמה: עגבניות',
        storageLabel: 'מיקום אחסון',
        typeLabel: 'סוג מוצר',
        quantityLabel: 'כמות',
        unitLabel: 'יחידת מידה',
        expiryLabel: 'תאריך תפוגה (אופציונלי)',
        notesLabel: 'הערות (אופציונלי)',
        submit: 'הוספה למזווה',
        submitting: 'מוסיף...',
        suggestionLoading: 'בודק המלצת אחסון...',
        suggestionMatchTitle: 'מיקום האחסון מתאים',
        suggestionMismatchTitle: 'יש המלצה טובה יותר',
        currentOptionLabel: 'הבחירה שלך',
        recommendedOptionLabel: 'מומלץ',
        selectRecommended: 'בחירה',
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
