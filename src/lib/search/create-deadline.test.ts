import { createDeadline } from './create-deadline'

describe('createDeadline', () => {
    it('clips caps to the remaining budget and never goes negative', () => {
        let clock = 1000
        const deadline = createDeadline(10_000, () => clock)

        expect(deadline.clip(5000)).toBe(5000)
        clock += 7000
        expect(deadline.remainingMs()).toBe(3000)
        expect(deadline.clip(5000)).toBe(3000)
        clock += 20_000
        expect(deadline.remainingMs()).toBe(0)
        expect(deadline.clip(5000)).toBe(0)
    })

    it('cannot start a step with less than the floor left', () => {
        let clock = 0
        const deadline = createDeadline(10_000, () => clock)

        clock = 9000
        expect(deadline.canStart()).toBe(true)
        clock = 9001
        expect(deadline.canStart()).toBe(false)
    })
})
