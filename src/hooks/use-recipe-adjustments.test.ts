import {
    act,
    renderHook
} from '@testing-library/react'

import { useRecipeAdjustments } from './use-recipe-adjustments'

describe('useRecipeAdjustments', () => {
    it('appends a replacement line to the instruction when toggled on', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })

        expect(result.current.values.instruction).toBe('להשתמש בחלב במקום חלב סויה')
        expect(result.current.values.usedReplacements['חלב סויה']).toBe(true)
    })

    it('removes the replacement line when toggled off again', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })
        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })

        expect(result.current.values.instruction).toBe('')
        expect(result.current.values.usedReplacements['חלב סויה']).toBe(false)
    })

    it('preserves manually typed text alongside toggled replacement lines', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.setField('instruction', 'בלי בצל')
        })
        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })

        expect(result.current.values.instruction).toBe('בלי בצל, להשתמש בחלב במקום חלב סויה')
    })

    it('resets instruction and replacement state', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })
        act(() => {
            result.current.actions.reset()
        })

        expect(result.current.values.instruction).toBe('')
        expect(result.current.values.usedReplacements).toEqual({})
    })

    it('appends a removal line to the instruction when toggled on', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleRemoval('בזיליקום לקישוט', 'בזיליקום לקישוט')
        })

        expect(result.current.values.instruction).toBe('בלי בזיליקום לקישוט')
        expect(result.current.values.usedRemovals['בזיליקום לקישוט']).toBe(true)
    })

    it('removes the removal line when toggled off again', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleRemoval('בזיליקום לקישוט', 'בזיליקום לקישוט')
        })
        act(() => {
            result.current.actions.toggleRemoval('בזיליקום לקישוט', 'בזיליקום לקישוט')
        })

        expect(result.current.values.instruction).toBe('')
        expect(result.current.values.usedRemovals['בזיליקום לקישוט']).toBe(false)
    })

    it('tracks replacement and removal lines independently', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })
        act(() => {
            result.current.actions.toggleRemoval('בזיליקום לקישוט', 'בזיליקום לקישוט')
        })

        expect(result.current.values.instruction).toBe(
            'להשתמש בחלב במקום חלב סויה, בלי בזיליקום לקישוט'
        )

        act(() => {
            result.current.actions.toggleReplacement('חלב סויה', 'חלב סויה', 'חלב')
        })

        expect(result.current.values.instruction).toBe('בלי בזיליקום לקישוט')
    })

    it('resets removal state too', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.toggleRemoval('בזיליקום לקישוט', 'בזיליקום לקישוט')
        })
        act(() => {
            result.current.actions.reset()
        })

        expect(result.current.values.usedRemovals).toEqual({})
    })

    it('remembers the chosen replacement without touching the prompt while it is not in use', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.actions.chooseReplacement('חלב', 'חלב', 'חלב סויה', 'חלב אורז')
        })

        expect(result.current.values.chosenReplacements['חלב']).toBe('חלב אורז')
        expect(result.current.values.instruction).toBe('')
    })

    it('swaps the prompt line when the replacement changes while it is in use', () => {
        const { result } = renderHook(() => useRecipeAdjustments())

        act(() => {
            result.current.setField('instruction', 'בלי בצל')
        })
        act(() => {
            result.current.actions.toggleReplacement('חלב', 'חלב', 'חלב סויה')
        })
        act(() => {
            result.current.actions.chooseReplacement('חלב', 'חלב', 'חלב סויה', 'חלב אורז')
        })

        expect(result.current.values.instruction).toBe('בלי בצל, להשתמש בחלב אורז במקום חלב')
    })
})
