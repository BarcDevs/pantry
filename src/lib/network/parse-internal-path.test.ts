import { parseInternalPath } from './parse-internal-path'

describe('parseInternalPath', () => {
    it.each([
        '/pantry?x=1',
        '/generate/result',
        '/pantry#top',
        '/%5Cevil.com'
    ])('keeps the same-origin path %s', (path) => {
        expect(parseInternalPath(path)).toBe(path)
    })

    it.each([
        '/\\evil.com',
        '/\\/evil.com',
        '//evil.com',
        '///evil.com',
        '/\t/evil.com',
        '/\n/evil.com',
        '/\r/evil.com',
        'https://evil.com',
        'evil.com',
        '',
        undefined
    ])('rejects %j', (path) => {
        expect(parseInternalPath(path)).toBeUndefined()
    })
})
