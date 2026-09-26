import {
    render,
    screen
} from '@testing-library/react'

import { RecipeSource } from '@/types/enums'

import { RecipeSourceLine } from '@/components/recipes/shared/recipe-source-line'

import { recipesTexts } from '@/constants/texts/recipes'

describe('RecipeSourceLine', () => {
    it('shows the AI label without a link for ai_generated recipes', () => {
        render(<RecipeSourceLine recipe={{ source: RecipeSource.AiGenerated }}/>)

        expect(screen.getByText(recipesTexts.result.sourceAi)).toBeInTheDocument()
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('links the source name to the source url in a new tab', () => {
        render(
            <RecipeSourceLine
                recipe={{
                    source: RecipeSource.ImportedUrl,
                    sourceUrl: 'https://a.co.il/recipe',
                    sourceName: 'אתר א'
                }}
            />
        )

        const link = screen.getByRole('link', { name: 'מקור: אתר א' })
        expect(link).toHaveAttribute('href', 'https://a.co.il/recipe')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('falls back to the hostname without www when the source name is missing', () => {
        render(
            <RecipeSourceLine
                recipe={{
                    source: RecipeSource.ImportedUrl,
                    sourceUrl: 'https://www.example.com/r/1'
                }}
            />
        )

        expect(screen.getByRole('link', { name: 'מקור: example.com' }))
            .toHaveAttribute('href', 'https://www.example.com/r/1')
    })

    it('renders nothing for text imports without a source url', () => {
        const { container } = render(
            <RecipeSourceLine recipe={{ source: RecipeSource.ImportedUrl }}/>
        )

        expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing for manual recipes', () => {
        const { container } = render(
            <RecipeSourceLine recipe={{ source: RecipeSource.Manual }}/>
        )

        expect(container).toBeEmptyDOMElement()
    })

    it('never renders an unsafe url as a link', () => {
        render(
            <RecipeSourceLine
                recipe={{
                    source: RecipeSource.ImportedUrl,
                    sourceUrl: 'javascript:alert(1)',
                    sourceName: 'אתר'
                }}
            />
        )

        expect(screen.getByText('מקור: אתר')).toBeInTheDocument()
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders nothing for an unsafe url without a name', () => {
        const { container } = render(
            <RecipeSourceLine
                recipe={{
                    source: RecipeSource.ImportedUrl,
                    sourceUrl: 'javascript:alert(1)'
                }}
            />
        )

        expect(container).toBeEmptyDOMElement()
    })
})

describe('RecipeSourceLine compact', () => {
    it('renders nothing for ai_generated recipes', () => {
        const { container } = render(
            <RecipeSourceLine
                recipe={{ source: RecipeSource.AiGenerated }}
                compact
            />
        )

        expect(container).toBeEmptyDOMElement()
    })

    it('still links a real web source', () => {
        render(
            <RecipeSourceLine
                recipe={{
                    source: RecipeSource.ImportedUrl,
                    sourceUrl: 'https://a.co.il/recipe',
                    sourceName: 'אתר א'
                }}
                compact
            />
        )

        expect(screen.getByRole('link', { name: 'מקור: אתר א' }))
            .toHaveAttribute('href', 'https://a.co.il/recipe')
    })
})
