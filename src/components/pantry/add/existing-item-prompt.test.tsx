import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { PantryUnit } from '@/types/enums'

import type { MergePrompt } from '@/hooks/use-add-item-form'

import { ExistingItemPrompt } from './existing-item-prompt'

const prompt = (isMerging: boolean): MergePrompt => ({
    existing: {
        _id: 'item1',
        name: 'חלב',
        quantity: 2,
        unit: PantryUnit.Units
    },
    isMerging,
    addedQuantity: 1,
    total: 3
})

describe('ExistingItemPrompt', () => {
    it('tells the user the item exists and offers a merge', () => {
        const onMerge = jest.fn()
        render(
            <ExistingItemPrompt
                prompt={prompt(false)}
                onMerge={onMerge}
                onCancel={jest.fn()}
            />
        )

        expect(screen.getByText('הפריט כבר קיים במזווה')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'מיזוג' }))
        expect(onMerge).toHaveBeenCalledTimes(1)
    })

    it('switches to the merging message with the old, added and total amounts', () => {
        const onCancel = jest.fn()
        render(
            <ExistingItemPrompt
                prompt={prompt(true)}
                onMerge={jest.fn()}
                onCancel={onCancel}
            />
        )

        expect(screen.getByText(/כעת ממזג: 2 \+ 1 = 3/)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'מיזוג' })).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'ביטול' }))
        expect(onCancel).toHaveBeenCalledTimes(1)
    })
})
