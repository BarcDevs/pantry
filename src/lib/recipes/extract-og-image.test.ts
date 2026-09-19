import { extractOgImage } from './extract-og-image'

const pageUrl = 'https://example.com/recipes/pasta'
const wrap = (meta: string) => `<html><head>${meta}</head><body></body></html>`

describe('extractOgImage', () => {
    it('reads og:image with property before content', () => {
        const html = wrap('<meta property="og:image" content="https://cdn.example.com/a.jpg">')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/a.jpg')
    })

    it('reads og:image with content before property and single quotes', () => {
        const html = wrap('<meta content=\'https://cdn.example.com/a.jpg\' property=\'og:image\' />')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/a.jpg')
    })

    it('accepts name="og:image", unquoted attributes and uppercase tags', () => {
        const html = wrap('<META NAME=og:image CONTENT=https://cdn.example.com/a.jpg>')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/a.jpg')
    })

    it('decodes html entities in the content attribute', () => {
        const html = wrap(
            '<meta property="og:image" content="https://cdn.example.com/a.jpg?w=1&amp;h=2&#38;q=3&#x26;x=&quot;">'
        )
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/a.jpg?w=1&h=2&q=3&x=%22')
    })

    it('keeps parentheses in the url', () => {
        const url = 'https://www.seriouseats.com/thmb/x/filters:no_upscale():max_bytes(150000):strip_icc()/x.jpg'
        const html = wrap(`<meta property="og:image" content="${url}">`)
        expect(extractOgImage(html, pageUrl)).toBe(url)
    })

    it('accepts og:image:secure_url when og:image is missing', () => {
        const html = wrap('<meta property="og:image:secure_url" content="https://cdn.example.com/s.jpg">')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/s.jpg')
    })

    it('falls back to twitter:image', () => {
        const html = wrap('<meta name="twitter:image" content="https://cdn.example.com/t.jpg">')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/t.jpg')
    })

    it('prefers og:image over twitter:image', () => {
        const html = wrap(
            '<meta name="twitter:image" content="https://cdn.example.com/t.jpg">'
            + '<meta property="og:image" content="https://cdn.example.com/o.jpg">'
        )
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/o.jpg')
    })

    it('falls back to twitter:image when og:image is unsafe', () => {
        const html = wrap(
            '<meta property="og:image" content="javascript:alert(1)">'
            + '<meta name="twitter:image" content="https://cdn.example.com/t.jpg">'
        )
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/t.jpg')
    })

    it('resolves a relative url against the page url', () => {
        const html = wrap('<meta property="og:image" content="/img/a.jpg">')
        expect(extractOgImage(html, pageUrl)).toBe('https://example.com/img/a.jpg')
    })

    it('resolves a protocol-relative url against the page url', () => {
        const html = wrap('<meta property="og:image" content="//cdn.example.com/a.jpg">')
        expect(extractOgImage(html, pageUrl)).toBe('https://cdn.example.com/a.jpg')
    })

    it('rejects unsafe schemes', () => {
        expect(extractOgImage(wrap('<meta property="og:image" content="javascript:alert(1)">'), pageUrl))
            .toBeUndefined()
        expect(extractOgImage(wrap('<meta property="og:image" content="data:image/png;base64,AAAA">'), pageUrl))
            .toBeUndefined()
    })

    it('rejects a very long url', () => {
        const longUrl = `https://cdn.example.com/${'a'.repeat(2100)}.jpg`
        const html = wrap(`<meta property="og:image" content="${longUrl}">`)
        expect(extractOgImage(html, pageUrl)).toBeUndefined()
    })

    it('ignores meta tags after the head', () => {
        const html = '<html><head></head><body><meta property="og:image" content="https://cdn.example.com/a.jpg"></body></html>'
        expect(extractOgImage(html, pageUrl)).toBeUndefined()
    })

    it('returns undefined when there is no image meta', () => {
        expect(extractOgImage(wrap('<meta charset="utf-8">'), pageUrl)).toBeUndefined()
    })
})
