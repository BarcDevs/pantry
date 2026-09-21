import {
    render,
    screen
} from '@testing-library/react'

import { GenerateNoMatchNotice } from '@/components/recipes/generate/generate-no-match-notice'

import { recipesTexts } from '@/constants/texts/recipes'

const texts = recipesTexts.generate

describe('GenerateNoMatchNotice', () => {
    it('shows the headline, AI and add-items hints, and the flexible hint when strict', () => {
        render(<GenerateNoMatchNotice isStrict={true}/>)

        expect(screen.getByText(texts.noMatchTitle)).toBeInTheDocument()
        expect(screen.getByText(texts.noMatchHints.enableAi)).toBeInTheDocument()
        expect(screen.getByText(texts.noMatchHints.flexibleMode)).toBeInTheDocument()
        expect(screen.getByText(texts.noMatchHints.addItems)).toBeInTheDocument()
    })

    it('omits the flexible-mode hint when already flexible', () => {
        render(<GenerateNoMatchNotice isStrict={false}/>)

        expect(screen.getByText(texts.noMatchHints.enableAi)).toBeInTheDocument()
        expect(screen.getByText(texts.noMatchHints.addItems)).toBeInTheDocument()
        expect(screen.queryByText(texts.noMatchHints.flexibleMode)).not.toBeInTheDocument()
    })
})
