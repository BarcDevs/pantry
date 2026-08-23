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

    it('returns red when expiring today', () => {
        const today = new Date()
        expect(getExpiryStatus(today).tone).toBe('red')
        expect(getExpiryStatus(today).daysLeft).toBe(0)
    })

    it('returns amber when expiring in 1-7 days', () => {
        const soon = new Date()
        soon.setDate(soon.getDate() + 5)
        expect(getExpiryStatus(soon).tone).toBe('amber')
    })

    it('returns green when expiring in more than 7 days', () => {
        const far = new Date()
        far.setDate(far.getDate() + 10)
        expect(getExpiryStatus(far).tone).toBe('green')
    })
})
