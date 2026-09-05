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
    typeFilterLabel: 'סוג מוצר',
    typeFilterClear: 'נקה',
    storageLabels: {
        fridge: 'מקרר',
        freezer: 'מקפיא',
        pantry: 'מזווה'
    },
    unitLabels: {
        kg: 'ק"ג',
        g: 'גרם',
        L: 'ליטר',
        ml: 'מל',
        units: 'יחידות'
    },
    expiredLabel: 'פג תוקף',
    expiredTodayLabel: 'פג היום',
    validLabel: 'תקף',
    daysLeftLabel: 'ימים',
    noExpiryLabel: 'ללא תאריך',
    noResults: 'לא נמצאו מוצרים תואמים',
    foodTypeLabels: {
        vegetables: 'ירקות',
        fruits: 'פירות',
        dairy: 'מוצרי חלב',
        eggs: 'ביצים',
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
        manualEntryTitle: 'הוספה ידנית',
        nameLabel: 'שם המוצר',
        namePlaceholder: 'לדוגמה: קישואים',
        emojiLabel: 'סמל',
        storageLabel: 'מיקום',
        typeLabel: 'סוג מוצר',
        quantityLabel: 'כמות',
        quantityError: 'יש להזין כמות חיובית',
        unitLabel: 'יחידה',
        expiryLabel: 'תאריך תפוגה',
        expiryPlaceholder: 'בחר תאריך',
        suggestionError: 'לא הצלחנו לקבל הצעה',
        suggestionNotRecognized: 'לא זיהינו מוצר מזון בשם הזה',
        suggestionRetry: 'נסה שוב',
        notesLabel: 'הערות (אופציונלי)',
        submit: 'הוספה למזווה',
        submitting: 'מוסיף...',
        saveSuccess: 'המוצר נוסף למזווה',
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
        saveError: 'שמירת המוצר נכשלה, נסה שוב'
    },
    duplicateDialog: {
        title: 'המוצר כבר קיים במזווה',
        description: 'כבר יש לכם מוצר בשם זה. תרצו למזג את הכמויות או לשמור כפריט נפרד?',
        merge: 'מיזוג כמויות',
        keepSeparate: 'שמירה כפריט נפרד'
    },
    scanReceipt: 'סריקת קבלה',
    pasteReceipt: 'הדבקת קישור קבלה',
    receiptReview: {
        title: 'סקירת קבלה',
        subtitle: 'בדקו את הפריטים, כווננו כמויות והסירו מה שלא רלוונטי לפני ההוספה.',
        uploadPrompt: 'העלו תמונה או PDF של הקבלה',
        uploadHint: 'התמונה מעובדת בשרת ואינה נשמרת',
        uploadButton: 'בחירת קובץ',
        scanning: 'סורק את הקבלה...',
        scanError: 'סריקת הקבלה נכשלה, נסה שוב',
        fileTooLarge: 'הקובץ גדול מדי, נסו קובץ עד 8MB',
        unsupportedFileType: 'סוג קובץ לא נתמך, נסו JPG, PNG, WebP או PDF',
        rescan: 'סריקה מחדש',
        selectAll: 'בחר הכל',
        clearAll: 'נקה הכל',
        removeItem: 'הסרה',
        emptyAfterScan: 'לא זוהו פריטים בקבלה',
        confirmButton: 'הוספה למזווה',
        cancelButton: 'ביטול',
        saveSuccess: 'הפריטים נוספו למזווה',
        saveError: 'הוספת הפריטים נכשלה, נסה שוב',
        urlTab: 'קישור',
        textTab: 'טקסט',
        urlLabel: 'קישור לקבלה או לעמוד הקנייה',
        urlPlaceholder: 'https://...',
        urlSubmit: 'ייבוא',
        urlError: 'לא הצלחנו לחלץ פריטים מהקישור',
        urlFallback: 'ניתן להזין את הפריטים ידנית במקום',
        manualEntryLink: 'הוספה ידנית',
        textTabComingSoon: 'ייבוא מטקסט יתווסף בקרוב'
    },
    editForm: {
        title: 'עריכת מוצר',
        submit: 'שמירת שינויים',
        submitting: 'שומר...',
        suggestButton: 'קבל המלצת אחסון',
        suggesting: 'בודק המלצת אחסון...',
        saveError: 'שמירת השינויים נכשלה, נסה שוב',
        saveSuccess: 'השינויים נשמרו',
        deleteButton: 'מחק מוצר',
        deleting: 'מוחק...',
        deleteError: 'מחיקת המוצר נכשלה, נסה שוב',
        deleteSuccess: 'המוצר נמחק'
    },
    deleteDialog: {
        title: 'למחוק את המוצר?',
        description: 'הפעולה תמחק את המוצר מהמזווה לצמיתות. לא ניתן לבטל.',
        cancel: 'ביטול',
        confirm: 'מחיקה'
    }
} as const
