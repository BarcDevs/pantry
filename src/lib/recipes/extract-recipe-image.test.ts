import { extractRecipeImage } from './extract-recipe-image'

const pageUrl = 'https://feastandfarm.com/classic-stuffed-peppers/'
const wrongOgImage = 'https://feastandfarm.com/wp-content/uploads/2020/01/FISH-TACOS-2.png'
const ogMeta = `<meta property="og:image" content="${wrongOgImage}">`
const recipeImage = 'https://feastandfarm.com/wp-content/uploads/2015/03/stuffedpeppers2small.jpg'

const page = (jsonLd: string[], meta = ogMeta): string => `<html><head>${meta}${
    jsonLd.map((block) => `<script type="application/ld+json">${block}</script>`).join('')
}</head><body></body></html>`

const recipeBlock = (image: unknown, type: unknown = 'Recipe'): string =>
    JSON.stringify({
        '@type': type,
        name: 'Stuffed peppers',
        image
    })

describe('extractRecipeImage', () => {
    it('prefers the JSON-LD Recipe image over a wrong og:image (feastandfarm shape)', () => {
        const html = page([
            JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'WebSite',
                        name: 'Feast and Farm'
                    },
                    {
                        '@type': 'Recipe',
                        name: 'Classic Stuffed Peppers',
                        image: [
                            recipeImage,
                            'https://feastandfarm.com/wp-content/uploads/2015/03/other-1x1.jpg'
                        ]
                    }
                ]
            })
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('reads an image given as a plain string', () => {
        expect(extractRecipeImage(page([recipeBlock(recipeImage)]), pageUrl)).toBe(recipeImage)
    })

    it('reads an ImageObject url', () => {
        const html = page([
            recipeBlock({
                '@type': 'ImageObject',
                url: recipeImage
            })
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('reads an array of ImageObjects', () => {
        const html = page([
            recipeBlock([
                {
                    '@type': 'ImageObject',
                    url: recipeImage
                }
            ])
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('resolves an image referenced by @id inside @graph', () => {
        const html = page([
            JSON.stringify({
                '@graph': [
                    {
                        '@type': 'ImageObject',
                        '@id': 'https://feastandfarm.com/#primaryimage',
                        url: recipeImage
                    },
                    {
                        '@type': 'Recipe',
                        image: { '@id': 'https://feastandfarm.com/#primaryimage' }
                    }
                ]
            })
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('accepts @type as an array', () => {
        const html = page([
            recipeBlock(
                recipeImage,
                [
                    'Article',
                    'Recipe'
                ]
            )
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('accepts a top-level array of nodes', () => {
        const html = page([
            JSON.stringify([
                { '@type': 'WebSite' },
                {
                    '@type': 'Recipe',
                    image: recipeImage
                }
            ])
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('resolves a relative JSON-LD image against the page url', () => {
        const html = page([recipeBlock('/img/peppers.jpg')])
        expect(extractRecipeImage(html, pageUrl)).toBe('https://feastandfarm.com/img/peppers.jpg')
    })

    it('skips unsafe candidates and uses the next usable one', () => {
        const html = page([
            recipeBlock([
                'javascript:alert(1)',
                `https://cdn.example.com/${'a'.repeat(2100)}.jpg`,
                recipeImage
            ])
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('ignores malformed JSON-LD blocks and reads a later valid one', () => {
        const html = page([
            '{ not valid json',
            recipeBlock(recipeImage)
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(recipeImage)
    })

    it('falls back to og:image when the JSON-LD is malformed', () => {
        const html = page(['{ not valid json'])
        expect(extractRecipeImage(html, pageUrl)).toBe(wrongOgImage)
    })

    it('falls back to og:image when there is no Recipe node', () => {
        const html = page([
            JSON.stringify({
                '@type': 'Article',
                image: recipeImage
            })
        ])
        expect(extractRecipeImage(html, pageUrl)).toBe(wrongOgImage)
    })

    it('falls back to og:image when the Recipe has no usable image', () => {
        const html = page([recipeBlock('data:image/png;base64,AAAA')])
        expect(extractRecipeImage(html, pageUrl)).toBe(wrongOgImage)
    })

    it('returns undefined when nothing is available', () => {
        expect(extractRecipeImage(page([], ''), pageUrl)).toBeUndefined()
    })
})
