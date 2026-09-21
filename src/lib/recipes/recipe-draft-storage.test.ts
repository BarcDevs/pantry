import type { RecipeDoc } from '@/types/recipe'

import {
    createRecipeDraftStorage,
    draftTtlMs
} from './recipe-draft-storage'

const storage = createRecipeDraftStorage('test:draft')
const recipe = { title: 'שקשוקה' } as RecipeDoc

describe('createRecipeDraftStorage', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.restoreAllMocks()
    })

    it('returns the saved recipe', () => {
        storage.save(recipe)

        expect(storage.read()).toEqual(recipe)
    })

    it('drops a removed image from the persisted draft', () => {
        const withImage = {
            ...recipe,
            imageUrl: 'https://example.com/a.jpg'
        }
        storage.save(withImage)
        storage.save({
            ...withImage,
            imageUrl: undefined
        })

        expect(storage.read()?.imageUrl).toBeUndefined()
        expect(localStorage.getItem('test:draft')).not.toContain('imageUrl')
    })

    it('expires the draft after the ttl and removes it', () => {
        storage.save(recipe)
        jest.spyOn(Date, 'now').mockReturnValue(Date.now() + draftTtlMs)

        expect(storage.read()).toBeNull()
        expect(localStorage.getItem('test:draft')).toBeNull()
    })

    it('keeps the draft just before the ttl', () => {
        storage.save(recipe)
        jest.spyOn(Date, 'now').mockReturnValue(Date.now() + draftTtlMs - 1000)

        expect(storage.read()).toEqual(recipe)
    })

    it('clears the draft', () => {
        storage.save(recipe)
        storage.clear()

        expect(storage.read()).toBeNull()
    })

    it('ignores corrupt storage', () => {
        localStorage.setItem('test:draft', '{not json')

        expect(storage.read()).toBeNull()
    })

    describe('context', () => {
        const contextStorage = createRecipeDraftStorage<{ tag: string }>('test:context-draft')

        it('stores and returns the context alongside the recipe', () => {
            contextStorage.save(recipe, { tag: 'a' })

            expect(contextStorage.read()).toEqual(recipe)
            expect(contextStorage.readContext()).toEqual({ tag: 'a' })
        })

        it('keeps the stored context when the recipe is saved again without one', () => {
            contextStorage.save(recipe, { tag: 'a' })
            contextStorage.save({
                ...recipe,
                title: 'edited'
            })

            expect(contextStorage.read()?.title).toBe('edited')
            expect(contextStorage.readContext()).toEqual({ tag: 'a' })
        })

        it('replaces the context when a new one is given', () => {
            contextStorage.save(recipe, { tag: 'a' })
            contextStorage.save(recipe, { tag: 'b' })

            expect(contextStorage.readContext()).toEqual({ tag: 'b' })
        })

        it('expires and clears the context together with the draft', () => {
            contextStorage.save(recipe, { tag: 'a' })
            jest.spyOn(Date, 'now').mockReturnValue(Date.now() + draftTtlMs)

            expect(contextStorage.readContext()).toBeNull()
            expect(localStorage.getItem('test:context-draft')).toBeNull()
        })

        it('does not carry an old context into a draft saved after clear', () => {
            contextStorage.save(recipe, { tag: 'a' })
            contextStorage.clear()
            contextStorage.save(recipe)

            expect(contextStorage.readContext()).toBeNull()
        })
    })
})
