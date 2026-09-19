import { resolveReplacementChoice } from './resolve-replacement-choice'

const ingredient = {
    replacementName: 'חלב סויה',
    replacementOptions: ['חלב סויה', 'חלב אורז']
}

describe('resolveReplacementChoice', () => {
    it('defaults to the closest replacement', () => {
        expect(resolveReplacementChoice(ingredient)).toBe('חלב סויה')
    })

    it('uses the chosen replacement when it is still an option', () => {
        expect(resolveReplacementChoice(ingredient, 'חלב אורז')).toBe('חלב אורז')
    })

    it('falls back to the default when the chosen replacement is no longer available', () => {
        expect(resolveReplacementChoice(ingredient, 'חלב שיבולת')).toBe('חלב סויה')
    })

    it('has no replacement when there are no options', () => {
        expect(resolveReplacementChoice({})).toBeUndefined()
    })
})
