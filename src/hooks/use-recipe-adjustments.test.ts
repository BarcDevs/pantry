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

        expect(result.current.instruction).toBe('בלי בצל, להשתמש בחלב במקום חלב סויה')
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

    it('appends a removal line to the instruction when toggled on', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleRemoval('בזיליקום לקישוט')
        })

        expect(result.current.instruction).toBe('בלי בזיליקום לקישוט')
        expect(result.current.usedRemovals['בזיליקום לקישוט']).toBe(true)
    })

    it('removes the removal line when toggled off again', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleRemoval('בזיליקום לקישוט')
        })
        act(() => {
            result.current.toggleRemoval('בזיליקום לקישוט')
        })

        expect(result.current.instruction).toBe('')
        expect(result.current.usedRemovals['בזיליקום לקישוט']).toBe(false)
    })

    it('tracks replacement and removal lines independently', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })
        act(() => {
            result.current.toggleRemoval('בזיליקום לקישוט')
        })

        expect(result.current.instruction).toBe(
            'להשתמש בחלב במקום חלב סויה, בלי בזיליקום לקישוט'
        )

        act(() => {
            result.current.toggleReplacement('חלב סויה', 'חלב')
        })

        expect(result.current.instruction).toBe('בלי בזיליקום לקישוט')
    })

    it('resets removal state too', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.toggleRemoval('בזיליקום לקישוט')
        })
        act(() => {
            result.current.reset()
        })

        expect(result.current.usedRemovals).toEqual({})
    })
})
