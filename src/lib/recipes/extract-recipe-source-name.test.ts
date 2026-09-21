import { extractRecipeSourceName } from './extract-recipe-source-name'

const pageUrl = 'https://www.example.co.il/recipe/1'

const jsonLd = (data: unknown): string =>
    `<script type="application/ld+json">${JSON.stringify(data)}</script>`

const page = (head: string): string =>
    `<html><head>${head}</head><body></body></html>`

describe('extractRecipeSourceName', () => {
    it('prefers the Recipe publisher name over og:site_name', () => {
        const html = page(
            jsonLd({
                '@type': 'Recipe',
                publisher: {
                    '@type': 'Organization',
                    name: 'מטבח של סבתא'
                }
            })
            + '<meta property="og:site_name" content="OG Name">'
        )
        expect(extractRecipeSourceName(html, pageUrl)).toBe('מטבח של סבתא')
    })

    it('reads publisher from a string and from an array inside a @graph Recipe', () => {
        expect(extractRecipeSourceName(
            page(jsonLd({
                '@type': 'Recipe',
                publisher: 'Plain Publisher'
            })),
            pageUrl
        )).toBe('Plain Publisher')
        expect(extractRecipeSourceName(
            page(jsonLd({
                '@graph': [
                    {
                        '@type': [
                            'Thing',
                            'Recipe'
                        ],
                        publisher: [{ name: 'Graph Publisher' }]
                    }
                ]
            })),
            pageUrl
        )).toBe('Graph Publisher')
    })

    it('ignores a publisher on a non-Recipe node and falls back to og:site_name', () => {
        const html = page(
            jsonLd({
                '@type': 'WebSite',
                publisher: { name: 'Not A Recipe' }
            })
            + '<meta property="og:site_name" content="  Site &amp; Co  ">'
        )
        expect(extractRecipeSourceName(html, pageUrl)).toBe('Site & Co')
    })

    it('falls back to the hostname without www', () => {
        expect(extractRecipeSourceName(page(''), pageUrl)).toBe('example.co.il')
    })

    it('returns undefined when nothing can be derived', () => {
        expect(extractRecipeSourceName(page(''), 'not a url')).toBeUndefined()
    })

    it('caps the name at 100 characters', () => {
        const html = page(
            `<meta property="og:site_name" content="${'a'.repeat(150)}">`
        )
        expect(extractRecipeSourceName(html, pageUrl)).toHaveLength(100)
    })
})
