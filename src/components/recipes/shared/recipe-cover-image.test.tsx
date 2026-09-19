import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { RecipeCoverImage } from './recipe-cover-image'

const imageUrl = 'https://x.com/filters:no_upscale():max_bytes(150000)/a.jpg'

describe('RecipeCoverImage', () => {
    it('renders the image with the raw url and no referrer', () => {
        const { container } = render(
            <RecipeCoverImage
                imageUrl={imageUrl}
                emoji={'🍝'}
                emojiClassName={'text-5xl'}
            />
        )
        const image = container.querySelector('img')
        expect(image).toHaveAttribute('src', imageUrl)
        expect(image).toHaveAttribute('referrerpolicy', 'no-referrer')
        expect(screen.queryByText('🍝')).toBeNull()
    })

    it('falls back to the emoji when the image fails to load', () => {
        const { container } = render(
            <RecipeCoverImage
                imageUrl={imageUrl}
                emoji={'🍝'}
                emojiClassName={'text-5xl'}
            />
        )
        fireEvent.error(container.querySelector('img') as HTMLImageElement)
        expect(container.querySelector('img')).toBeNull()
        expect(screen.getByText('🍝')).toBeInTheDocument()
    })

    it('shows the emoji when there is no image', () => {
        render(<RecipeCoverImage emojiClassName={'text-5xl'}/>)
        expect(screen.getByText('🍽️')).toBeInTheDocument()
    })
})
