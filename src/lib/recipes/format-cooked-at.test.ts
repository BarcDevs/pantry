import { formatCookedAt }
    from './format-cooked-at'

describe('formatCookedAt', () => {
    it('formats today as "היום · HH:mm"', () => {
        const now = new Date()
        now.setHours(19, 40, 0, 0)
        expect(formatCookedAt(now)).toBe('היום · 19:40')
    })

    it('formats yesterday as "אתמול · HH:mm"', () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(19, 40, 0, 0)
        expect(formatCookedAt(yesterday)).toBe('אתמול · 19:40')
    })

    it('formats older dates as "d בMMMM · HH:mm"', () => {
        const older = new Date('2026-06-12T13:25:00')
        expect(formatCookedAt(older)).toBe('12 ביוני · 13:25')
    })
})
