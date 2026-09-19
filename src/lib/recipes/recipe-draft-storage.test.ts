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
})
