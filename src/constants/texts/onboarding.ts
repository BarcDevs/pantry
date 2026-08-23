export const onboardingTexts = {
    skip: 'דילוג',
    skipAll: 'דלגו על הכל',
    back: 'חזרה',
    next: 'הבא',
    finish: 'סיום',
    stepLabels: ['רמת בישול', 'העדפות תזונה', 'גודל משק בית'],
    stepCookingLevelTitle: 'מה רמת הבישול שלכם? 🍳',
    stepCookingLevelSubtitle: 'נתאים את מורכבות המתכונים שנציע לרמה שנוחה לכם.',
    stepDietaryPreferencesTitle: 'העדפות תזונה 🥗',
    stepDietaryPreferencesSubtitle: 'בחרו כל מה שרלוונטי — נסנן מתכונים בהתאם. אפשר לדלג ולעדכן בהמשך.',
    stepHouseholdSizeTitle: 'לכמה אנשים בדרך כלל? 🍽️',
    stepHouseholdSizeSubtitle: 'נשתמש בזה כדי לכוון כמויות ומנות במתכונים שנציע.',
    householdSizeSingular: 'נפש אחת',
    householdSizePlural: 'נפשות',
    dietaryCountPrefix: 'נבחרו',
    dietaryCountEmpty: 'ללא העדפות מיוחדות',
    saveError: 'שמירת ההעדפות נכשלה, נסה שוב',
    cookingLevels: {
        easy: {
            emoji: '🌱',
            title: 'מתחיל',
            desc: 'מתכונים פשוטים עם מעט מרכיבים ושלבים'
        },
        medium: {
            emoji: '🍳',
            title: 'בינוני',
            desc: 'נוח במטבח, אשמח לגוון ולהתנסות'
        },
        hard: {
            emoji: '👨‍🍳',
            title: 'מתקדם',
            desc: 'טכניקות מתקדמות ומתכונים מורכבים'
        }
    },
    dietaryOptions: {
        vegetarian: { emoji: '🥦', label: 'צמחוני' },
        vegan: { emoji: '🌱', label: 'טבעוני' },
        glutenFree: { emoji: '🌾', label: 'ללא גלוטן' },
        dairyFree: { emoji: '🥛', label: 'ללא חלב' },
        kosher: { emoji: '✡️', label: 'כשר' },
        lowCarb: { emoji: '🥩', label: 'דל פחמימות' }
    }
} as const
