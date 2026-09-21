import { useForm } from 'react-hook-form'

import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { GenerateDishField } from '@/components/recipes/generate/generate-dish-field'
import { Form } from '@/components/ui/form'

import { recipesTexts } from '@/constants/texts/recipes'

import type { GenerateRecipeFormValues } from '@/schemas/generate-recipe-form'

const texts = recipesTexts.generate

const FormHarness = () => {
    const form = useForm<GenerateRecipeFormValues>({
        defaultValues: { customInstructions: '' }
    })

    return (
        <Form {...form}>
            <GenerateDishField control={form.control}/>
        </Form>
    )
}

describe('GenerateDishField', () => {
    it('shows the design label, optional marker, hint and placeholder', () => {
        render(<FormHarness/>)

        expect(screen.getByText(texts.dishLabel)).toBeInTheDocument()
        expect(screen.getByText(texts.dishOptionalMarker)).toBeInTheDocument()
        expect(screen.getByText(texts.dishHint)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(texts.dishPlaceholder)).toBeInTheDocument()
    })

    it('labels the input and keeps the typed dish in the form value', () => {
        render(<FormHarness/>)

        const input = screen.getByLabelText(texts.dishLabel)
        fireEvent.change(input, { target: { value: 'לזניה' } })

        expect(input).toHaveValue('לזניה')
    })
})
