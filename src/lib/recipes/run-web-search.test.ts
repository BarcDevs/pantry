jest.mock('@/config/env', () => ({
    __esModule: true,
    default: { e2eMockSearch: false }
}))
jest.mock('@/lib/recipes/find-web-recipe', () => ({
    findWebRecipe: jest.fn()
}))
jest.mock('@/lib/search/create-search-client', () => ({
    createSearchClient: jest.fn()
}))

import { findWebRecipe } from '@/lib/recipes/find-web-recipe'
import { createSearchClient } from '@/lib/search/create-search-client'

import env from '@/config/env'

import { runWebSearch } from './run-web-search'

const mockFindWebRecipe = findWebRecipe as jest.Mock
const mockCreateSearchClient = createSearchClient as jest.Mock
const mockEnv = env as { e2eMockSearch: boolean }

const input = {
    request: { mealType: 'dinner' as const },
    userId: 'user_1',
    selectedPantryItems: [],
    allPantryItems: []
} as never

describe('runWebSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockEnv.e2eMockSearch = false
    })

    it('runs the real pipeline and reports it attempted when a search client is configured', async () => {
        const searchClient = { search: jest.fn() }
        mockCreateSearchClient.mockReturnValue(searchClient)
        mockFindWebRecipe.mockResolvedValue({ title: 'מהרשת' })

        const result = await runWebSearch(input)

        expect(result).toEqual({
            recipe: { title: 'מהרשת' },
            searchAttempted: true
        })
        expect(mockFindWebRecipe).toHaveBeenCalledWith(input, { searchClient })
    })

    it('reports the search as not attempted when no client is configured', async () => {
        mockCreateSearchClient.mockReturnValue(null)

        const result = await runWebSearch(input)

        expect(result).toEqual({ recipe: null, searchAttempted: false })
        expect(mockFindWebRecipe).not.toHaveBeenCalled()
    })

    it('returns the mock recipe without touching the real pipeline when E2E_MOCK_SEARCH is set', async () => {
        mockEnv.e2eMockSearch = true

        const result = await runWebSearch(input, () => ({ title: 'מוק' }) as never)

        expect(result).toEqual({ recipe: { title: 'מוק' }, searchAttempted: true })
        expect(mockCreateSearchClient).not.toHaveBeenCalled()
        expect(mockFindWebRecipe).not.toHaveBeenCalled()
    })

    it('allows a mock that returns null, distinct from "no mock provided"', async () => {
        mockEnv.e2eMockSearch = true

        const result = await runWebSearch(input, () => null)

        expect(result).toEqual({ recipe: null, searchAttempted: true })
    })

    it('throws when E2E_MOCK_SEARCH is set but no mock is given', async () => {
        mockEnv.e2eMockSearch = true

        await expect(runWebSearch(input)).rejects.toThrow(
            'runWebSearch called without a mock while E2E_MOCK_SEARCH=true'
        )
    })
})
