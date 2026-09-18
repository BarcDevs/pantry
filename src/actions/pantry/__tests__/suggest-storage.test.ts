/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { suggestStorage } from '../suggest-storage'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock

const suggestion = {
    recognized: true,
    suggestedStorage: 'fridge',
    reason: 'שומר על טריות',
    expiryByStorage: {
        fridge: { date: '2026-07-19', reason: 'שומר על טריות' },
        freezer: { date: '2027-01-12', reason: 'עוצר קלקול אך פוגע במרקם' },
        pantry: { date: '2026-07-14', reason: 'מתקלקל מהר בטמפרטורת חדר' }
    }
}

describe('suggestStorage', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(suggestStorage('עגבניות')).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('returns the AI-generated storage suggestion', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(suggestion)

        const result = await suggestStorage('עגבניות')

        expect(result).toEqual(suggestion)
        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.stringContaining('עגבניות'),
            expect.anything(),
            expect.any(Function),
            0
        )
    })
})
