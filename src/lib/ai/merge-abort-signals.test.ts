import { mergeAbortSignals } from './merge-abort-signals'

describe('mergeAbortSignals', () => {
    it('returns undefined when there is nothing to combine', () => {
        expect(mergeAbortSignals({})).toBeUndefined()
    })

    it('aborts when the given signal aborts', () => {
        const controller = new AbortController()
        const merged = mergeAbortSignals({
            timeoutMs: 60_000,
            signal: controller.signal
        })

        expect(merged?.aborted).toBe(false)
        controller.abort()
        expect(merged?.aborted).toBe(true)
    })

    it('uses only the timeout when no signal is given', () => {
        expect(mergeAbortSignals({ timeoutMs: 60_000 })?.aborted).toBe(false)
    })
})
