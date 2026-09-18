/**
 * @jest-environment node
 */
jest.mock('@/lib/auth', () => ({
    auth: jest.fn()
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { suggestStorageBatch } from '../suggest-storage-batch'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock

const entry = { date: '2026-07-19', reason: 'שומר על טריות' }

const makeSuggestion = (name: string) => ({
    name,
    recognized: true,
    suggestedStorage: 'fridge',
    reason: 'שומר על טריות',
    expiryByStorage: {
        fridge: entry,
        freezer: entry,
        pantry: entry
    }
})

describe('suggestStorageBatch', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(suggestStorageBatch(['חלב'])).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('suggests every item in a single AI call, aligned to input order', async () => {
        mockGenerateStructured.mockResolvedValue({
            suggestions: [makeSuggestion('חלב-א'), makeSuggestion('גבינה-א')]
        })

        const result = await suggestStorageBatch(['גבינה-א', 'חלב-א'])

        expect(mockGenerateStructured).toHaveBeenCalledTimes(1)
        expect(result[0]).toMatchObject({ suggestedStorage: 'fridge' })
        expect(result).toHaveLength(2)
    })

    it('returns null for items the AI did not answer', async () => {
        mockGenerateStructured.mockResolvedValue({
            suggestions: [makeSuggestion('ענבים-ב')]
        })

        const result = await suggestStorageBatch(['ענבים-ב', 'תמר-ב'])

        expect(result[0]).not.toBeNull()
        expect(result[1]).toBeNull()
    })

    it('skips the AI call when every item is cached', async () => {
        mockGenerateStructured.mockResolvedValue({
            suggestions: [makeSuggestion('אבטיח-ג')]
        })
        await suggestStorageBatch(['אבטיח-ג'])
        mockGenerateStructured.mockClear()

        const result = await suggestStorageBatch(['אבטיח-ג'])

        expect(mockGenerateStructured).not.toHaveBeenCalled()
        expect(result[0]).not.toBeNull()
    })
})
