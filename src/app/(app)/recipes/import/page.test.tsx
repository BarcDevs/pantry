import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import ImportRecipePage from './page'

const importFromUrl = jest.fn()
const importFromText = jest.fn()

jest.mock('next/navigation', () => ({
    useRouter: () => ({ back: jest.fn() })
}))
jest.mock('@/hooks/use-recipe-import', () => ({
    useRecipeImport: () => ({
        recipe: null,
        error: null,
        isImporting: false,
        isSaving: false,
        importFromUrl,
        importFromText,
        setTitle: jest.fn(),
        save: jest.fn()
    })
}))

describe('ImportRecipePage Enter', () => {
    beforeEach(() => jest.clearAllMocks())

    it('imports the url on Enter in the url field', () => {
        render(<ImportRecipePage/>)
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: 'example.com/recipe' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(importFromUrl).toHaveBeenCalledWith('example.com/recipe')
    })

    it('does not import an invalid url on Enter', () => {
        render(<ImportRecipePage/>)
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: 'not-a-url' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(importFromUrl).not.toHaveBeenCalled()
    })
})
