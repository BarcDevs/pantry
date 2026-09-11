const PREP_MODIFIER_WORDS = new Set([
    'קצוץ', 'קצוצה', 'קצוצים', 'קצוצות',
    'פרוס', 'פרוסה', 'פרוסים', 'פרוסות',
    'טחון', 'טחונה', 'טחונים', 'טחונות',
    'מגורר', 'מגוררת', 'מגוררים', 'מגוררות',
    'קפוא', 'קפואה', 'קפואים', 'קפואות',
    'טרי', 'טריה', 'טריים', 'טריות',
    'חתוך', 'חתוכה', 'חתוכים', 'חתוכות',
    'מרוסק', 'מרוסקת', 'מרוסקים', 'מרוסקות',
    'שלם', 'שלמה', 'שלמים', 'שלמות',
    'יבש', 'יבשה', 'יבשים', 'יבשות',
    'חצוי', 'חצויה', 'חצויים', 'חצויות',
    'מבושל', 'מבושלת', 'מבושלים', 'מבושלות',
    'קלוף', 'קלופה', 'קלופים', 'קלופות'
])

export const rawNameWords = (name: string): string[] => (
    name.trim().split(/\s+/).filter((word) => word.length > 0)
)

export const normalizeItemName = (name: string): string => (
    name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => !PREP_MODIFIER_WORDS.has(word))
        .join(' ')
)

export const nameWords = (name: string): string[] => (
    normalizeItemName(name).split(/\s+/).filter((word) => word.length > 1)
)

/**
 * Produce-color words are always interchangeable for replacement matching (green
 * pepper substitutes for red pepper) - unlike other descriptor words, which do signal
 * a real type difference (hot pepper is not a sweet pepper) and must keep blocking a
 * match. Black/white are deliberately excluded - they usually name a different food
 * entirely (black pepper is a spice, not a color variant of bell pepper), and the
 * `category` field (vegetables vs condiments) is the safer signal for that distinction.
 */
const COLOR_WORDS = new Set([
    'אדום', 'אדומה', 'אדומים', 'אדומות',
    'ירוק', 'ירוקה', 'ירוקים', 'ירוקות',
    'צהוב', 'צהובה', 'צהובים', 'צהובות',
    'כתום', 'כתומה', 'כתומים', 'כתומות',
    'סגול', 'סגולה', 'סגולים', 'סגולות'
])

/** `nameWords` with color descriptors dropped - used only for replacement matching. */
export const nameWordsForMatching = (name: string): string[] => (
    nameWords(name).filter((word) => !COLOR_WORDS.has(word))
)

/** Strips prep/state words while preserving the original casing - used to derive a
 *  fallback baseName from the display name, not for matching. */
export const stripPrepWords = (name: string): string => (
    rawNameWords(name)
        .filter((word) => !PREP_MODIFIER_WORDS.has(word.toLowerCase()))
        .join(' ')
)
