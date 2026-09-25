import { render } from '@testing-library/react'

import { SpiceLevelIndicator } from './spice-level-indicator'

describe('SpiceLevelIndicator', () => {
    it('renders nothing when spiceLevel is 0', () => {
        const { container } = render(<SpiceLevelIndicator spiceLevel={0}/>)

        expect(container).toBeEmptyDOMElement()
    })

    it('renders one pepper per spice level', () => {
        const { container } = render(<SpiceLevelIndicator spiceLevel={2}/>)

        expect(container.textContent).toBe('🌶️🌶️')
    })

    it('renders three peppers at max level', () => {
        const { container } = render(<SpiceLevelIndicator spiceLevel={3}/>)

        expect(container.textContent).toBe('🌶️🌶️🌶️')
    })
})
