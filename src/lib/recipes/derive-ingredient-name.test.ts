import { deriveIngredientName } from './derive-ingredient-name'

describe('deriveIngredientName', () => {
    it('strips a known prep/state word (chopped onion -> onion)', () => {
        expect(deriveIngredientName('בצל קצוץ')).toBe('בצל')
    })

    it('keeps a distinguishing color word (green pepper stays green pepper)', () => {
        expect(deriveIngredientName('פלפלים ירוקים')).toBe('פלפלים ירוקים')
    })

    it('keeps a distinguishing color word (black pepper stays black pepper)', () => {
        expect(deriveIngredientName('פלפל שחור')).toBe('פלפל שחור')
    })

    it('keeps a real type-changing word not in the prep-word list (garlic powder stays distinct from fresh garlic)', () => {
        expect(deriveIngredientName('אבקת שום')).toBe('אבקת שום')
    })

    it('keeps a real type-changing word (soy milk stays distinct from milk)', () => {
        expect(deriveIngredientName('חלב סויה')).toBe('חלב סויה')
    })

    it('returns the label unchanged when it has no prep words', () => {
        expect(deriveIngredientName('שמן')).toBe('שמן')
    })
})
