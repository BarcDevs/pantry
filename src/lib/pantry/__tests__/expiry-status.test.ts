import { getExpiryStatus } from '../expiry-status'

describe('getExpiryStatus', () => {
    it('returns none when there is no expiry date', () => {
        expect(getExpiryStatus(undefined)).toEqual({
            tone: 'none',
            daysLeft: null
        })
    })

    it('returns red when already expired', () => {
        const past = new Date()
        past.setDate(past.getDate() - 1)
        expect(getExpiryStatus(past).tone).toBe('red')
    })

    it('returns red when expiring in under 3 days', () => {
        const soon = new Date()
        soon.setDate(soon.getDate() + 2)
        expect(getExpiryStatus(soon).tone).toBe('red')
    })

    it('returns amber when expiring in 3-7 days', () => {
        const mid = new Date()
        mid.setDate(mid.getDate() + 5)
        expect(getExpiryStatus(mid).tone).toBe('amber')
    })

    it('returns green when expiring in more than 7 days', () => {
        const far = new Date()
        far.setDate(far.getDate() + 10)
        expect(getExpiryStatus(far).tone).toBe('green')
    })
})
