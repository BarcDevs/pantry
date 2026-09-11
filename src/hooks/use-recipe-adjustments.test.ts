import {
    act,
    renderHook
} from '@testing-library/react'

import { useRecipeAdjustments } from './use-recipe-adjustments'

describe('useRecipeAdjustments', () => {
    it('appends a replacement line to the instruction when toggled on', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })

        expect(result.current.instruction).toBe('להשתמש בחלב במקום חלב סויה')
        expect(result.current.usedReplacements['חלב סויה']).toBe(true)
    })

    it('removes the replacement line when toggled off again', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })
        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })

        expect(result.current.instruction).toBe('')
        expect(result.current.usedReplacements['חלב סויה']).toBe(false)
    })

    it('preserves manually typed text alongside toggled replacement lines', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.setInstruction('בלי בצל')
        })
        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })

        expect(result.current.instruction).toBe('בלי בצל\nלהשתמש בחלב במקום חלב סויה')
    })

    it('resets instruction and replacement state', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })
        act(() => {
            result.current.reset()
        })

        expect(result.current.instruction).toBe('')
        expect(result.current.usedReplacements).toEqual({})
    })
})
