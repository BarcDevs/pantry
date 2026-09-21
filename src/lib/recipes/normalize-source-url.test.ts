import { normalizeSourceUrl } from './normalize-source-url'

describe('normalizeSourceUrl', () => {
    it('ignores scheme, www, query, hash, host case and trailing slashes', () => {
        const base = normalizeSourceUrl('https://a.co.il/recipes/lasagna')

        expect(normalizeSourceUrl('http://www.A.co.il/recipes/lasagna/?utm=1#x')).toBe(base)
    })

    it('keeps different paths and different hosts apart', () => {
        const base = normalizeSourceUrl('https://a.co.il/recipes/lasagna')

        expect(normalizeSourceUrl('https://a.co.il/recipes/pizza')).not.toBe(base)
        expect(normalizeSourceUrl('https://b.co.il/recipes/lasagna')).not.toBe(base)
    })

    it('falls back to the lowercase trimmed input for a non-URL', () => {
        expect(normalizeSourceUrl(' Not A Url ')).toBe('not a url')
    })
})
