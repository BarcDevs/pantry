import { signOut } from 'next-auth/react'

import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { clearAllRecipeDrafts } from '@/lib/recipes/clear-all-recipe-drafts'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

import { LogoutButton } from './logout-button'

jest.mock('next-auth/react', () => ({
    signOut: jest.fn()
}))
jest.mock('@/lib/recipes/clear-all-recipe-drafts', () => ({
    clearAllRecipeDrafts: jest.fn()
}))

describe('LogoutButton', () => {
    it('clears recipe drafts before signing out', () => {
        render(<LogoutButton/>)

        fireEvent.click(screen.getByText(settingsTexts.logout))

        expect(clearAllRecipeDrafts).toHaveBeenCalled()
        expect(signOut).toHaveBeenCalledWith({ callbackUrl: routes.landing })
        expect((clearAllRecipeDrafts as jest.Mock).mock.invocationCallOrder[0])
            .toBeLessThan((signOut as jest.Mock).mock.invocationCallOrder[0])
    })
})
